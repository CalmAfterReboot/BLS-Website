<#
.SYNOPSIS
    Collects baseline server inventory data and outputs structured JSON.

.DESCRIPTION
    Read-only inventory collector for Windows Server discovery and audit work.
    Captures OS, hardware, roles, features, basic configuration, and uptime.
    Designed to run safely on production servers during routine MSP work.

    Output is JSON, saved to C:\Temp\audit\<hostname>-inventory-<timestamp>.json
    by default, or to a path supplied via -OutputPath.

    No services restarted. No registry writes. No configuration changes.
    Uses CIM/WMI and built-in cmdlets only - no third-party modules.

.PARAMETER OutputPath
    Optional. Full path for the JSON output file. If omitted, defaults to
    C:\Temp\audit\<hostname>-inventory-<timestamp>.json. The parent folder
    is created if missing.

.PARAMETER PassThru
    Optional. Also write the JSON to stdout for pipeline use.

.EXAMPLE
    .\collect-server-inventory.ps1
    Run with defaults. Writes JSON to C:\Temp\audit\.

.EXAMPLE
    .\collect-server-inventory.ps1 -OutputPath D:\audit\srv01.json -PassThru
    Custom path, also echoes JSON to stdout.

.NOTES
    Author     : (your name) - BLS Discovery Toolkit
    Version    : 0.1.0
    PS version : 5.1+
    Tested on  : Windows Server 2016, 2019, 2022
    Permissions: Local admin recommended (some WMI classes require elevation)
#>

[CmdletBinding()]
param(
    [string]$OutputPath,
    [switch]$PassThru
)

# ----- Setup ------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$startedAt              = Get-Date
$scriptVersion          = '0.1.0'
$hostName               = $env:COMPUTERNAME

if (-not $OutputPath) {
    $defaultFolder = 'C:\Temp\audit'
    if (-not (Test-Path $defaultFolder)) {
        New-Item -Path $defaultFolder -ItemType Directory -Force | Out-Null
    }
    $stamp      = Get-Date -Format 'yyyyMMdd-HHmmss'
    $OutputPath = Join-Path $defaultFolder "$hostName-inventory-$stamp.json"
}

# ----- Helper: safe property fetch --------------------------------------------
# Wraps WMI/CIM calls so a single failure does not abort the whole script.

function Get-Safe {
    param(
        [scriptblock]$Block,
        [string]$Context = 'unknown'
    )
    try {
        & $Block
    } catch {
        Write-Verbose "Safe-fetch failed in context '$Context': $($_.Exception.Message)"
        return $null
    }
}

Write-Verbose "Starting server inventory collection on $hostName"

# ----- 1. Operating system ----------------------------------------------------

$os = Get-Safe -Context 'OS' -Block {
    $cim = Get-CimInstance -ClassName Win32_OperatingSystem
    [pscustomobject]@{
        Caption          = $cim.Caption
        Version          = $cim.Version
        BuildNumber      = $cim.BuildNumber
        Architecture     = $cim.OSArchitecture
        InstallDate      = $cim.InstallDate
        LastBootUpTime   = $cim.LastBootUpTime
        UptimeDays       = [math]::Round(((Get-Date) - $cim.LastBootUpTime).TotalDays, 1)
        SystemDirectory  = $cim.SystemDirectory
        TotalVisibleMemoryMB = [math]::Round($cim.TotalVisibleMemorySize / 1024, 0)
        FreePhysicalMemoryMB = [math]::Round($cim.FreePhysicalMemory     / 1024, 0)
        OSLanguage       = $cim.OSLanguage
        Locale           = $cim.Locale
        ProductType      = $cim.ProductType  # 1=Workstation 2=DC 3=Server
        TimeZone         = (Get-TimeZone).Id
    }
}

# ----- 2. Computer system / hardware ------------------------------------------

$hardware = Get-Safe -Context 'Hardware' -Block {
    $cs   = Get-CimInstance -ClassName Win32_ComputerSystem
    $bios = Get-CimInstance -ClassName Win32_BIOS
    $cpu  = Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1

    [pscustomobject]@{
        Manufacturer       = $cs.Manufacturer
        Model              = $cs.Model
        SerialNumber       = $bios.SerialNumber
        BIOSVersion        = $bios.SMBIOSBIOSVersion
        BIOSReleaseDate    = $bios.ReleaseDate
        SystemType         = $cs.SystemType
        Domain             = $cs.Domain
        PartOfDomain       = $cs.PartOfDomain
        DomainRole         = $cs.DomainRole  # 0=Standalone WS 1=Member WS 2=Standalone Srv 3=Member Srv 4=Backup DC 5=Primary DC
        NumberOfLogicalProcessors  = $cs.NumberOfLogicalProcessors
        NumberOfProcessors         = $cs.NumberOfProcessors
        CPUName            = $cpu.Name
        CPUMaxClockMHz     = $cpu.MaxClockSpeed
        CPUCores           = $cpu.NumberOfCores
        CPULogicalCores    = $cpu.NumberOfLogicalProcessors
        TotalPhysicalMemoryGB = [math]::Round($cs.TotalPhysicalMemory / 1GB, 1)
        Virtual            = if ($cs.Model -match 'Virtual|VMware|KVM|Xen|HyperV') { $true } else { $false }
    }
}

# ----- 3. Disks / volumes -----------------------------------------------------

$volumes = Get-Safe -Context 'Volumes' -Block {
    Get-CimInstance -ClassName Win32_LogicalDisk -Filter 'DriveType=3' |
        ForEach-Object {
            [pscustomobject]@{
                DriveLetter    = $_.DeviceID
                Label          = $_.VolumeName
                FileSystem     = $_.FileSystem
                SizeGB         = [math]::Round($_.Size      / 1GB, 1)
                FreeSpaceGB    = [math]::Round($_.FreeSpace / 1GB, 1)
                FreePercent    = if ($_.Size) {
                                     [math]::Round(($_.FreeSpace / $_.Size) * 100, 1)
                                 } else { 0 }
            }
        }
}

# ----- 4. Network ----------------------------------------------------------------

$network = Get-Safe -Context 'Network' -Block {
    $adapters = Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -Filter 'IPEnabled = True'

    $adapterList = foreach ($a in $adapters) {
        [pscustomobject]@{
            Description    = $a.Description
            MACAddress     = $a.MACAddress
            IPAddresses    = @($a.IPAddress)
            SubnetMasks    = @($a.IPSubnet)
            DefaultGateway = @($a.DefaultIPGateway)
            DNSServers     = @($a.DNSServerSearchOrder)
            DHCPEnabled    = $a.DHCPEnabled
            DHCPServer     = $a.DHCPServer
            DNSDomain      = $a.DNSDomain
        }
    }

    [pscustomobject]@{
        Hostname  = $hostName
        FQDN      = ([System.Net.Dns]::GetHostByName($hostName).HostName)
        Adapters  = @($adapterList)
    }
}

# ----- 5. Roles & features (Server only) --------------------------------------

$roles = Get-Safe -Context 'Roles' -Block {
    if ($os.ProductType -eq 1) {
        # Workstation - skip server roles
        return $null
    }
    Get-WindowsFeature -ErrorAction SilentlyContinue |
        Where-Object { $_.Installed -eq $true } |
        Select-Object Name, DisplayName, FeatureType |
        ForEach-Object {
            [pscustomobject]@{
                Name        = $_.Name
                DisplayName = $_.DisplayName
                FeatureType = $_.FeatureType.ToString()
            }
        }
}

# ----- 6. Pending reboot signal -----------------------------------------------

$pendingReboot = Get-Safe -Context 'PendingReboot' -Block {
    $signals = @()

    if (Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending') {
        $signals += 'CBS.RebootPending'
    }
    if (Test-Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired') {
        $signals += 'WindowsUpdate.RebootRequired'
    }
    $pfro = Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager' -Name 'PendingFileRenameOperations' -ErrorAction SilentlyContinue
    if ($pfro -and $pfro.PendingFileRenameOperations) {
        $signals += 'PendingFileRenameOperations'
    }

    [pscustomobject]@{
        PendingReboot = ($signals.Count -gt 0)
        Signals       = $signals
    }
}

# ----- 7. Activation / license state ------------------------------------------

$activation = Get-Safe -Context 'Activation' -Block {
    $svc = Get-CimInstance -ClassName SoftwareLicensingProduct `
            -Filter "ApplicationId='55c92734-d682-4d71-983e-d6ec3f16059f' AND PartialProductKey IS NOT NULL" `
            -ErrorAction SilentlyContinue |
           Select-Object -First 1

    if (-not $svc) { return $null }

    $statusMap = @{
        0 = 'Unlicensed'
        1 = 'Licensed'
        2 = 'OOBGrace'
        3 = 'OOTGrace'
        4 = 'NonGenuineGrace'
        5 = 'Notification'
        6 = 'ExtendedGrace'
    }
    [pscustomobject]@{
        Name              = $svc.Name
        Description       = $svc.Description
        LicenseStatus     = $statusMap[[int]$svc.LicenseStatus]
        PartialProductKey = $svc.PartialProductKey
    }
}

# ----- Compose final object ---------------------------------------------------

$collectionMetadata = [pscustomobject]@{
    CollectorName    = 'collect-server-inventory'
    CollectorVersion = $scriptVersion
    CollectedAt      = (Get-Date).ToString('o')
    CollectedBy      = "$env:USERDOMAIN\$env:USERNAME"
    Hostname         = $hostName
    DurationSeconds  = [math]::Round(((Get-Date) - $startedAt).TotalSeconds, 2)
    SchemaVersion    = '0.1.0'
}

$result = [pscustomobject]@{
    Metadata      = $collectionMetadata
    OperatingSystem = $os
    Hardware      = $hardware
    Volumes       = $volumes
    Network       = $network
    RolesAndFeatures = $roles
    PendingReboot = $pendingReboot
    Activation    = $activation
}

# ----- Output -----------------------------------------------------------------

$json = $result | ConvertTo-Json -Depth 8

try {
    $json | Out-File -FilePath $OutputPath -Encoding UTF8 -Force
    Write-Host "Inventory written: $OutputPath" -ForegroundColor Green
    Write-Host "Hostname        : $hostName"
    Write-Host "Duration        : $($collectionMetadata.DurationSeconds)s"
    Write-Host "Output bytes    : $((Get-Item $OutputPath).Length)"
} catch {
    Write-Error "Failed to write JSON output to $OutputPath`: $($_.Exception.Message)"
    exit 1
}

if ($PassThru) {
    $json
}
