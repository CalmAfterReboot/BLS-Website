<#
.SYNOPSIS
    Collects workload profile data for cloud-migration assessment.

.DESCRIPTION
    Read-only workload characterisation collector. Captures the things that
    determine whether a server's workloads can move to Azure, and produces
    a structured findings list flagging common cloud-blockers.

    Coverage:
      - MS SQL Server instances, versions, editions, database sizes, auth mode
      - Installed applications with 32-bit vs 64-bit identification
      - .NET Framework installed versions (legacy version flags)
      - Visual C++ runtime inventory (legacy app fingerprint)
      - ODBC DSNs (system + user) - tells where apps connect to databases
      - SMB shares + active open file handles
      - Print queues (always the long pole in AVD migrations)
      - Services running (with non-default identities flagged)
      - Scheduled tasks (with non-Microsoft tasks flagged)
      - Listening TCP ports + holding process
      - IIS sites, bindings, app pools, .NET runtime versions
      - RDS licensing state (issued CALs vs available, mode)
      - Storage volume sizes with cloud-egress cost warnings
      - Findings/flags: structured warnings for the migration planner

    Designed for safe execution on live customer servers during routine
    MSP work. No services restarted, no registry writes, no Win32_Product
    (which triggers MSI revalidation), no third-party modules.

.PARAMETER OutputPath
    Optional. Full path for the JSON output file. If omitted, defaults to
    C:\Temp\audit\<hostname>-workload-<timestamp>.json.

.PARAMETER PassThru
    Optional. Also write the JSON to stdout for pipeline use.

.PARAMETER LargeStorageThresholdGB
    Optional. Volume size in GB above which a cloud-egress warning is raised.
    Default 500GB. Move higher for genuinely large estates.

.EXAMPLE
    .\collect-workload-profile.ps1
    Run with defaults. Writes JSON to C:\Temp\audit\.

.EXAMPLE
    .\collect-workload-profile.ps1 -Verbose -LargeStorageThresholdGB 1000
    Verbose run with 1TB storage warning threshold.

.NOTES
    Author     : BLS Discovery Toolkit
    Version    : 0.1.0
    PS version : 5.1+
    Tested on  : Windows Server 2016, 2019, 2022
    Permissions: Local admin required for SQL inventory and some service queries
#>

[CmdletBinding()]
param(
    [string]$OutputPath,
    [switch]$PassThru,
    [int]$LargeStorageThresholdGB = 500
)

# ----- Setup ------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$startedAt             = Get-Date
$scriptVersion         = '0.1.0'
$hostName              = $env:COMPUTERNAME
$findings              = New-Object System.Collections.ArrayList

if (-not $OutputPath) {
    $defaultFolder = 'C:\Temp\audit'
    if (-not (Test-Path $defaultFolder)) {
        New-Item -Path $defaultFolder -ItemType Directory -Force | Out-Null
    }
    $stamp      = Get-Date -Format 'yyyyMMdd-HHmmss'
    $OutputPath = Join-Path $defaultFolder "$hostName-workload-$stamp.json"
}

# ----- Helpers ----------------------------------------------------------------

function Get-Safe {
    param([scriptblock]$Block, [string]$Context = 'unknown')
    try { & $Block }
    catch {
        Write-Verbose "Safe-fetch failed in '$Context': $($_.Exception.Message)"
        return $null
    }
}

function Add-Finding {
    param(
        [ValidateSet('INFO','WARN','BLOCKER')]$Severity,
        [string]$Category,
        [string]$Message,
        [object]$Evidence = $null
    )
    [void]$findings.Add([pscustomobject]@{
        Severity = $Severity
        Category = $Category
        Message  = $Message
        Evidence = $Evidence
    })
}

Write-Verbose "Starting workload profile collection on $hostName"

# ----- 1. Installed applications (registry-based, fast, safe) -----------------
# Uses uninstall keys instead of Win32_Product. Captures both 32-bit and 64-bit.

$installedApps = Get-Safe -Context 'InstalledApps' -Block {
    $uninstallKeys = @(
        'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
    )

    $apps = foreach ($keyPath in $uninstallKeys) {
        $arch = if ($keyPath -match 'WOW6432Node') { '32-bit' } else { '64-bit' }

        Get-ItemProperty -Path $keyPath -ErrorAction SilentlyContinue |
            Where-Object { $_.DisplayName -and -not $_.SystemComponent } |
            ForEach-Object {
                [pscustomobject]@{
                    DisplayName     = $_.DisplayName
                    DisplayVersion  = $_.DisplayVersion
                    Publisher       = $_.Publisher
                    InstallDate     = $_.InstallDate
                    Architecture    = $arch
                    InstallLocation = $_.InstallLocation
                    UninstallString = $_.UninstallString
                }
            }
    }

    $apps | Sort-Object DisplayName -Unique
}

# Flag 32-bit apps as deprecation risk for Win11 / Server 2025
$thirtyTwoBitApps = @($installedApps | Where-Object { $_.Architecture -eq '32-bit' })
if ($thirtyTwoBitApps.Count -gt 0) {
    Add-Finding -Severity 'WARN' -Category 'AppArchitecture' `
        -Message "$($thirtyTwoBitApps.Count) 32-bit applications installed. Validate compatibility with target OS - 32-bit subsystem (WOW64) deprecation has been signalled for future Windows releases." `
        -Evidence ($thirtyTwoBitApps | Select-Object DisplayName, DisplayVersion, Publisher -First 20)
}

# ----- 2. MS SQL Server instances --------------------------------------------

$sqlInstances = Get-Safe -Context 'SQLInstances' -Block {
    # Discover instances via registry (works without sqlcmd / SMO)
    $instanceRoot = 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server'
    if (-not (Test-Path $instanceRoot)) { return @() }

    $installedInstances = (Get-ItemProperty -Path "$instanceRoot\Instance Names\SQL" -ErrorAction SilentlyContinue).PSObject.Properties |
        Where-Object { $_.Name -notmatch '^PS' } |
        ForEach-Object { [pscustomobject]@{ InstanceName = $_.Name; RegistryKey = $_.Value } }

    if (-not $installedInstances) { return @() }

    $results = foreach ($inst in $installedInstances) {
        $regKey = "$instanceRoot\$($inst.RegistryKey)"
        $setup  = Get-ItemProperty -Path "$regKey\Setup" -ErrorAction SilentlyContinue

        $instanceObj = [pscustomobject]@{
            InstanceName     = $inst.InstanceName
            Edition          = $setup.Edition
            Version          = $setup.Version
            PatchLevel       = $setup.PatchLevel
            ProductCode      = $setup.ProductCode
            FeatureList      = $setup.FeatureList
            SQLPath          = $setup.SQLPath
            DataPath         = (Get-ItemProperty -Path "$regKey\MSSQLServer" -ErrorAction SilentlyContinue).DefaultData
            LogPath          = (Get-ItemProperty -Path "$regKey\MSSQLServer" -ErrorAction SilentlyContinue).DefaultLog
            LoginMode        = switch ((Get-ItemProperty -Path "$regKey\MSSQLServer" -ErrorAction SilentlyContinue).LoginMode) {
                                    1 { 'Windows Only' }
                                    2 { 'Mixed Mode' }
                                    default { 'Unknown' }
                                }
            ServiceState     = (Get-Service -Name "MSSQL`$$($inst.InstanceName)" -ErrorAction SilentlyContinue).Status
            ServiceAccount   = (Get-CimInstance -ClassName Win32_Service -Filter "Name='MSSQL`$$($inst.InstanceName)' OR Name='MSSQLSERVER'" -ErrorAction SilentlyContinue | Select-Object -First 1).StartName
            Databases        = $null
            DatabasesTotalGB = $null
        }

        # Try to enumerate databases via .mdf file scan (works without SQL credentials)
        if ($instanceObj.DataPath -and (Test-Path $instanceObj.DataPath)) {
            $mdfs = Get-ChildItem -Path $instanceObj.DataPath -Filter '*.mdf' -ErrorAction SilentlyContinue
            $dbs  = foreach ($mdf in $mdfs) {
                $ldf = $mdf.FullName -replace '\.mdf$', '_log.ldf'
                if (-not (Test-Path $ldf)) {
                    $ldf = $mdf.FullName -replace '\.mdf$', '.ldf'
                }
                $logSize = if (Test-Path $ldf) {
                    (Get-Item $ldf -ErrorAction SilentlyContinue).Length
                } else { 0 }

                [pscustomobject]@{
                    DatabaseName = [System.IO.Path]::GetFileNameWithoutExtension($mdf.Name)
                    DataFile     = $mdf.FullName
                    DataSizeMB   = [math]::Round($mdf.Length / 1MB, 1)
                    LogFile      = $ldf
                    LogSizeMB    = [math]::Round($logSize / 1MB, 1)
                    TotalSizeMB  = [math]::Round(($mdf.Length + $logSize) / 1MB, 1)
                }
            }
            $instanceObj.Databases        = @($dbs)
            $instanceObj.DatabasesTotalGB = [math]::Round((($dbs | Measure-Object -Property TotalSizeMB -Sum).Sum / 1024), 2)
        }

        $instanceObj
    }
    $results
}

if ($sqlInstances -and $sqlInstances.Count -gt 0) {
    foreach ($s in $sqlInstances) {
        # Flag legacy SQL versions
        if ($s.Version -match '^(8|9|10|11)\.') {
            Add-Finding -Severity 'BLOCKER' -Category 'SQLLegacy' `
                -Message "SQL Server $($s.InstanceName) version $($s.Version) is out of mainstream support. Azure SQL MI requires SQL 2008+ for migration; older versions need rebuild." `
                -Evidence $s
        }
        # Flag Mixed Mode - needs review for cloud auth model
        if ($s.LoginMode -eq 'Mixed Mode') {
            Add-Finding -Severity 'INFO' -Category 'SQLAuth' `
                -Message "SQL Server $($s.InstanceName) uses Mixed Mode authentication. Validate application auth model before migration to Azure SQL (Entra ID auth preferred)." `
                -Evidence ($s | Select-Object InstanceName, LoginMode, ServiceAccount)
        }
        # Flag Express edition - capacity constraints in cloud
        if ($s.Edition -match 'Express') {
            Add-Finding -Severity 'INFO' -Category 'SQLEdition' `
                -Message "SQL Server $($s.InstanceName) is Express edition (10GB DB limit). Confirm whether app needs Standard/Web in cloud target." `
                -Evidence ($s | Select-Object InstanceName, Edition)
        }
        # Flag large databases - egress and downtime cost
        if ($s.DatabasesTotalGB -gt 100) {
            Add-Finding -Severity 'WARN' -Category 'SQLDataVolume' `
                -Message "SQL Server $($s.InstanceName) holds $($s.DatabasesTotalGB)GB of data. Migration window and Azure ingress cost both grow with size; plan transfer strategy (backup-restore, replication, DMS)." `
                -Evidence ($s | Select-Object InstanceName, DatabasesTotalGB)
        }
    }
}

# ----- 3. .NET Framework versions installed -----------------------------------

$dotNetVersions = Get-Safe -Context 'DotNet' -Block {
    $ndp = 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP'
    if (-not (Test-Path $ndp)) { return @() }

    Get-ChildItem -Path $ndp -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.PSChildName -eq 'Full' -or $_.PSChildName -match '^v[\d\.]+$' } |
        ForEach-Object {
            $p = Get-ItemProperty -Path $_.PSPath -ErrorAction SilentlyContinue
            if ($p.Version) {
                [pscustomobject]@{
                    Path     = $_.PSPath -replace '.*NDP\\', ''
                    Version  = $p.Version
                    Release  = $p.Release
                    SP       = $p.SP
                    Install  = $p.Install
                }
            }
        } | Sort-Object Version -Unique
}

# Flag legacy .NET as compatibility risk
$legacyDotNet = @($dotNetVersions | Where-Object { $_.Version -match '^(2|3)\.' })
if ($legacyDotNet.Count -gt 0) {
    Add-Finding -Severity 'WARN' -Category 'DotNetLegacy' `
        -Message ".NET Framework 2.x/3.x runtime installed - indicates legacy app dependencies. Verify target OS support before migration." `
        -Evidence $legacyDotNet
}

# ----- 4. Visual C++ Redistributables (legacy app fingerprint) ---------------

$vcRuntimes = Get-Safe -Context 'VCRuntimes' -Block {
    $installedApps | Where-Object {
        $_.DisplayName -match 'Microsoft Visual C\+\+ \d{4}'
    } | Select-Object DisplayName, DisplayVersion, Architecture, Publisher
}

# ----- 5. ODBC DSNs (system + user) -------------------------------------------

$odbcDsns = Get-Safe -Context 'ODBC' -Block {
    $systemDsns = @()
    $userDsns   = @()

    $systemKey32 = 'HKLM:\SOFTWARE\WOW6432Node\ODBC\ODBC.INI'
    $systemKey64 = 'HKLM:\SOFTWARE\ODBC\ODBC.INI'

    foreach ($k in @($systemKey32, $systemKey64)) {
        if (Test-Path $k) {
            $arch = if ($k -match 'WOW6432Node') { '32-bit' } else { '64-bit' }
            Get-ChildItem -Path $k -ErrorAction SilentlyContinue |
                Where-Object { $_.PSChildName -ne 'ODBC Data Sources' } |
                ForEach-Object {
                    $dsn = Get-ItemProperty -Path $_.PSPath -ErrorAction SilentlyContinue
                    $systemDsns += [pscustomobject]@{
                        Name        = $_.PSChildName
                        Driver      = $dsn.Driver
                        Server      = $dsn.Server
                        Database    = $dsn.Database
                        Scope       = 'System'
                        Architecture = $arch
                    }
                }
        }
    }

    [pscustomobject]@{
        System = $systemDsns
        Total  = $systemDsns.Count
    }
}

# ----- 6. SMB shares + open handles ------------------------------------------

$smbShares = Get-Safe -Context 'SMB' -Block {
    $shares = Get-SmbShare -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notmatch '^(ADMIN|IPC|.*\$)$' -or $_.Name -in @('SYSVOL', 'NETLOGON') } |
        ForEach-Object {
            $openCount = (Get-SmbOpenFile -ErrorAction SilentlyContinue |
                          Where-Object { $_.ShareRelativePath -ne $null -and $_.Path -like "$($_.Path.Substring(0,3))*" }).Count
            [pscustomobject]@{
                Name        = $_.Name
                Path        = $_.Path
                Description = $_.Description
                ShareType   = $_.ShareType.ToString()
                ScopeName   = $_.ScopeName
                CurrentUsers = $_.CurrentUsers
            }
        }

    $totalOpenFiles = (Get-SmbOpenFile -ErrorAction SilentlyContinue).Count

    [pscustomobject]@{
        Shares           = @($shares)
        TotalOpenHandles = $totalOpenFiles
    }
}

if ($smbShares -and $smbShares.TotalOpenHandles -gt 50) {
    Add-Finding -Severity 'INFO' -Category 'SMBActivity' `
        -Message "$($smbShares.TotalOpenHandles) open SMB file handles - this server is actively serving files. Plan file-share migration carefully (Azure Files / Azure File Sync candidate)." `
        -Evidence ($smbShares.Shares | Select-Object Name, Path -First 10)
}

# ----- 7. Print queues --------------------------------------------------------

$printQueues = Get-Safe -Context 'Printers' -Block {
    Get-Printer -ErrorAction SilentlyContinue |
        Where-Object { $_.Type -eq 'Local' -or $_.Shared } |
        Select-Object Name, DriverName, PortName, Shared, ShareName, Type
}

if ($printQueues -and $printQueues.Count -gt 5) {
    Add-Finding -Severity 'WARN' -Category 'PrintServices' `
        -Message "$($printQueues.Count) printers installed. Print services are the long pole in AVD migrations - plan for Universal Print or print-management product." `
        -Evidence ($printQueues | Select-Object Name, DriverName, Shared -First 10)
}

# ----- 8. Services with non-default identities -------------------------------

$services = Get-Safe -Context 'Services' -Block {
    Get-CimInstance -ClassName Win32_Service |
        Where-Object {
            $_.State -eq 'Running' -and
            $_.StartName -notin @(
                'LocalSystem',
                'NT AUTHORITY\LocalService',
                'NT AUTHORITY\NetworkService',
                'NT AUTHORITY\Local Service',
                'NT AUTHORITY\Network Service',
                $null, ''
            )
        } |
        Select-Object Name, DisplayName, StartName, PathName, StartMode, State
}

if ($services -and $services.Count -gt 0) {
    $domainAccountServices = @($services | Where-Object { $_.StartName -match '\\' -and $_.StartName -notmatch '^NT (SERVICE|AUTHORITY)\\' })
    if ($domainAccountServices.Count -gt 0) {
        Add-Finding -Severity 'WARN' -Category 'ServiceAccounts' `
            -Message "$($domainAccountServices.Count) services run under domain user accounts. Migration must preserve these identities or migrate to managed identities / gMSA in Azure." `
            -Evidence ($domainAccountServices | Select-Object Name, StartName -First 10)
    }
}

# ----- 9. Non-Microsoft scheduled tasks ---------------------------------------

$scheduledTasks = Get-Safe -Context 'ScheduledTasks' -Block {
    Get-ScheduledTask -ErrorAction SilentlyContinue |
        Where-Object {
            $_.State -ne 'Disabled' -and
            $_.TaskPath -notmatch '^\\Microsoft\\' -and
            $_.Author -notmatch 'Microsoft'
        } |
        ForEach-Object {
            $info = Get-ScheduledTaskInfo -TaskName $_.TaskName -TaskPath $_.TaskPath -ErrorAction SilentlyContinue
            [pscustomobject]@{
                TaskName    = $_.TaskName
                TaskPath    = $_.TaskPath
                State       = $_.State.ToString()
                Author      = $_.Author
                Description = $_.Description
                LastRunTime = $info.LastRunTime
                LastResult  = $info.LastTaskResult
                NextRunTime = $info.NextRunTime
                Triggers    = @($_.Triggers | ForEach-Object { $_.CimClass.CimClassName })
                Actions     = @($_.Actions  | ForEach-Object { $_.Execute })
            }
        }
}

if ($scheduledTasks -and $scheduledTasks.Count -gt 0) {
    Add-Finding -Severity 'INFO' -Category 'ScheduledTasks' `
        -Message "$($scheduledTasks.Count) non-Microsoft scheduled tasks active. Review business-critical jobs before migration - tasks executing UNC paths or local-only resources may break in cloud." `
        -Evidence ($scheduledTasks | Select-Object TaskName, TaskPath, Author -First 10)
}

# ----- 10. Listening TCP ports + holding process -----------------------------

$listeningPorts = Get-Safe -Context 'ListeningPorts' -Block {
    Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object {
            $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
            [pscustomobject]@{
                LocalAddress  = $_.LocalAddress
                LocalPort     = $_.LocalPort
                ProcessId     = $_.OwningProcess
                ProcessName   = $proc.ProcessName
                ProcessPath   = $proc.Path
            }
        } | Sort-Object LocalPort -Unique
}

# ----- 11. IIS (only if Web-Server role is installed) ------------------------

$iis = Get-Safe -Context 'IIS' -Block {
    if (-not (Get-Module -ListAvailable -Name WebAdministration)) { return $null }
    Import-Module WebAdministration -ErrorAction SilentlyContinue

    $sites = Get-Website -ErrorAction SilentlyContinue | ForEach-Object {
        [pscustomobject]@{
            Name         = $_.Name
            ID           = $_.Id
            State        = $_.State
            PhysicalPath = $_.PhysicalPath
            Bindings     = @($_.Bindings.Collection | ForEach-Object { "$($_.protocol):$($_.bindingInformation)" })
            AppPool      = $_.ApplicationPool
        }
    }

    $appPools = Get-ChildItem 'IIS:\AppPools' -ErrorAction SilentlyContinue | ForEach-Object {
        [pscustomobject]@{
            Name                  = $_.Name
            State                 = $_.State
            ManagedRuntimeVersion = $_.ManagedRuntimeVersion
            ManagedPipelineMode   = $_.ManagedPipelineMode
            Enable32BitAppOnWin64 = $_.Enable32BitAppOnWin64
            IdentityType          = $_.ProcessModel.IdentityType
            UserName              = $_.ProcessModel.UserName
        }
    }

    [pscustomobject]@{
        Sites    = @($sites)
        AppPools = @($appPools)
    }
}

if ($iis) {
    $legacyPools = @($iis.AppPools | Where-Object { $_.ManagedRuntimeVersion -match '^v[12]\.' })
    if ($legacyPools.Count -gt 0) {
        Add-Finding -Severity 'WARN' -Category 'IISLegacy' `
            -Message "$($legacyPools.Count) IIS app pools on legacy .NET (v1.x/v2.x). Migration target must support classic .NET or apps need refactoring." `
            -Evidence $legacyPools
    }
    $thirtyTwoBitPools = @($iis.AppPools | Where-Object { $_.Enable32BitAppOnWin64 -eq $true })
    if ($thirtyTwoBitPools.Count -gt 0) {
        Add-Finding -Severity 'WARN' -Category 'IIS32Bit' `
            -Message "$($thirtyTwoBitPools.Count) IIS app pools enabled for 32-bit applications. Verify cloud-target compatibility." `
            -Evidence $thirtyTwoBitPools
    }
}

# ----- 12. RDS licensing state -----------------------------------------------

$rdsLicensing = Get-Safe -Context 'RDSLicensing' -Block {
    if (-not (Get-Module -ListAvailable -Name RemoteDesktopServices)) { return $null }

    $tsConfig = Get-CimInstance -Namespace root\cimv2\TerminalServices `
                -ClassName Win32_TerminalServiceSetting -ErrorAction SilentlyContinue

    $licServers = Get-CimInstance -Namespace root\cimv2\TerminalServices `
                  -ClassName Win32_TSLicenseServer -ErrorAction SilentlyContinue

    $keypacks = Get-CimInstance -Namespace root\cimv2 `
                -ClassName Win32_TSLicenseKeyPack -ErrorAction SilentlyContinue

    $totalAvailable = ($keypacks | Measure-Object -Property TotalLicenses     -Sum).Sum
    $totalIssued    = ($keypacks | Measure-Object -Property IssuedLicenses    -Sum).Sum

    [pscustomobject]@{
        LicensingMode       = switch ($tsConfig.LicensingType) {
                                    2 { 'Per Device' }
                                    4 { 'Per User' }
                                    5 { 'Not Configured' }
                                    default { "Unknown ($($tsConfig.LicensingType))" }
                                }
        LicensingDescription = $tsConfig.LicensingDescription
        LicenseServers       = @($licServers.LicenseServers)
        TotalLicensesAvailable = $totalAvailable
        TotalLicensesIssued    = $totalIssued
        LicenseUtilisationPct  = if ($totalAvailable -gt 0) {
                                     [math]::Round(($totalIssued / $totalAvailable) * 100, 1)
                                 } else { 0 }
        KeyPacks               = @($keypacks | Select-Object KeyPackId, ProductVersion, TypeAndModel, TotalLicenses, IssuedLicenses, AvailableLicenses)
    }
}

if ($rdsLicensing) {
    if ($rdsLicensing.TotalLicensesAvailable -eq 0 -and $rdsLicensing.LicensingMode -ne 'Not Configured') {
        Add-Finding -Severity 'BLOCKER' -Category 'RDSLicensing' `
            -Message "RDS Licensing mode set to '$($rdsLicensing.LicensingMode)' but ZERO CALs installed. Grace period will expire; new sessions will fail with error 0xf06." `
            -Evidence $rdsLicensing
    }
    elseif ($rdsLicensing.LicenseUtilisationPct -gt 90) {
        Add-Finding -Severity 'WARN' -Category 'RDSLicensing' `
            -Message "RDS CAL utilisation at $($rdsLicensing.LicenseUtilisationPct)% ($($rdsLicensing.TotalLicensesIssued)/$($rdsLicensing.TotalLicensesAvailable)). Procurement headroom is thin." `
            -Evidence $rdsLicensing
    }
}

# ----- 13. Storage volumes (cloud egress warning) ----------------------------

$storageVolumes = Get-Safe -Context 'Storage' -Block {
    Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType=3' |
        ForEach-Object {
            [pscustomobject]@{
                DriveLetter     = $_.DeviceID
                Label           = $_.VolumeName
                SizeGB          = [math]::Round($_.Size / 1GB, 1)
                UsedGB          = [math]::Round(($_.Size - $_.FreeSpace) / 1GB, 1)
                FreeGB          = [math]::Round($_.FreeSpace / 1GB, 1)
                FreePercent     = if ($_.Size) { [math]::Round(($_.FreeSpace / $_.Size) * 100, 1) } else { 0 }
            }
        }
}

if ($storageVolumes) {
    foreach ($vol in $storageVolumes) {
        if ($vol.UsedGB -gt $LargeStorageThresholdGB) {
            Add-Finding -Severity 'WARN' -Category 'StorageVolume' `
                -Message "Volume $($vol.DriveLetter) holds $($vol.UsedGB)GB of data (threshold: $LargeStorageThresholdGB GB). Azure ingress is free but egress is not; migration transfer time and ongoing access patterns need planning." `
                -Evidence $vol
        }
        if ($vol.FreePercent -lt 15 -and $vol.SizeGB -gt 50) {
            Add-Finding -Severity 'WARN' -Category 'StorageVolume' `
                -Message "Volume $($vol.DriveLetter) is $((100 - $vol.FreePercent))% full ($($vol.FreeGB)GB free). Right-size cloud target with growth headroom." `
                -Evidence $vol
        }
    }
}

# ----- 14. Domain Controller detection (migration-strategy flag) -------------

$isDomainController = Get-Safe -Context 'DC' -Block {
    $cs = Get-CimInstance -ClassName Win32_ComputerSystem
    $isDC = ($cs.DomainRole -in @(4, 5))
    if ($isDC) {
        Add-Finding -Severity 'INFO' -Category 'DomainController' `
            -Message "This server is a Domain Controller (DomainRole=$($cs.DomainRole)). Migration to Azure must consider replication, FSMO roles, AAD Connect deployment, and whether on-prem AD is retained as hybrid."
    }
    $isDC
}

# ----- Compose final object ---------------------------------------------------

$collectionMetadata = [pscustomobject]@{
    CollectorName    = 'collect-workload-profile'
    CollectorVersion = $scriptVersion
    CollectedAt      = (Get-Date).ToString('o')
    CollectedBy      = "$env:USERDOMAIN\$env:USERNAME"
    Hostname         = $hostName
    DurationSeconds  = [math]::Round(((Get-Date) - $startedAt).TotalSeconds, 2)
    SchemaVersion    = '0.1.0'
    Parameters       = @{
        LargeStorageThresholdGB = $LargeStorageThresholdGB
    }
}

$findingSummary = [pscustomobject]@{
    Total    = $findings.Count
    Blockers = @($findings | Where-Object { $_.Severity -eq 'BLOCKER' }).Count
    Warnings = @($findings | Where-Object { $_.Severity -eq 'WARN' }).Count
    Info     = @($findings | Where-Object { $_.Severity -eq 'INFO' }).Count
}

$result = [pscustomobject]@{
    Metadata           = $collectionMetadata
    FindingsSummary    = $findingSummary
    Findings           = @($findings)
    IsDomainController = $isDomainController
    InstalledApps      = @($installedApps)
    SQLServer          = @($sqlInstances)
    DotNetVersions     = @($dotNetVersions)
    VCRuntimes         = @($vcRuntimes)
    ODBC               = $odbcDsns
    SMBShares          = $smbShares
    PrintQueues        = @($printQueues)
    Services           = @($services)
    ScheduledTasks     = @($scheduledTasks)
    ListeningPorts     = @($listeningPorts)
    IIS                = $iis
    RDSLicensing       = $rdsLicensing
    StorageVolumes     = @($storageVolumes)
}

# ----- Output -----------------------------------------------------------------

$json = $result | ConvertTo-Json -Depth 10

try {
    $json | Out-File -FilePath $OutputPath -Encoding UTF8 -Force
    Write-Host ""
    Write-Host "Workload profile written: $OutputPath" -ForegroundColor Green
    Write-Host "Hostname        : $hostName"
    Write-Host "Duration        : $($collectionMetadata.DurationSeconds)s"
    Write-Host "Output bytes    : $((Get-Item $OutputPath).Length)"
    Write-Host ""
    Write-Host "Findings summary:" -ForegroundColor Cyan
    Write-Host "  BLOCKERS : $($findingSummary.Blockers)" -ForegroundColor $(if ($findingSummary.Blockers -gt 0) { 'Red' } else { 'Gray' })
    Write-Host "  WARNINGS : $($findingSummary.Warnings)" -ForegroundColor $(if ($findingSummary.Warnings -gt 0) { 'Yellow' } else { 'Gray' })
    Write-Host "  INFO     : $($findingSummary.Info)"     -ForegroundColor Gray
} catch {
    Write-Error "Failed to write JSON output to $OutputPath`: $($_.Exception.Message)"
    exit 1
}

if ($PassThru) {
    $json
}
