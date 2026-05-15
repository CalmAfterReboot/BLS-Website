import type { InventoryDoc, WorkloadDoc } from "@/types/audit-viewer";

export const DEMO_INVENTORY: InventoryDoc = {
  Metadata: {
    CollectorName: "collect-server-inventory",
    CollectorVersion: "0.1.0",
    CollectedAt: "2026-05-15T09:14:22.000Z",
    CollectedBy: "EXAMPLE\\svc.audit",
    Hostname: "HOST-DEMO-01",
    DurationSeconds: 4.2,
    SchemaVersion: "0.1.0",
  },
  OperatingSystem: {
    Caption: "Microsoft Windows Server 2016 Standard",
    Version: "10.0.14393",
    BuildNumber: "14393",
    Architecture: "64-bit",
    UptimeDays: 187.4,
    TotalVisibleMemoryMB: 16384,
    FreePhysicalMemoryMB: 4108,
    ProductType: 3,
    TimeZone: "GMT Standard Time",
  },
  Hardware: {
    Manufacturer: "VMware, Inc.",
    Model: "VMware Virtual Platform",
    SerialNumber: "VMware-DEMO-0001",
    CPUName: "Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz",
    CPUCores: 4,
    CPULogicalCores: 8,
    TotalPhysicalMemoryGB: 16,
    Domain: "example.local",
    PartOfDomain: true,
    DomainRole: 3,
    Virtual: true,
  },
  Volumes: [
    { DriveLetter: "C:", Label: "System",  FileSystem: "NTFS", SizeGB: 120,  FreeSpaceGB: 42, FreePercent: 35 },
    { DriveLetter: "D:", Label: "Data",    FileSystem: "NTFS", SizeGB: 1024, FreeSpaceGB: 92, FreePercent: 9  },
    { DriveLetter: "E:", Label: "Backups", FileSystem: "NTFS", SizeGB: 2048, FreeSpaceGB: 410, FreePercent: 20 },
  ],
  Network: {
    Hostname: "HOST-DEMO-01",
    FQDN: "host-demo-01.example.local",
    Adapters: [
      {
        Description: "vmxnet3 Ethernet Adapter",
        MACAddress: "00:50:56:AA:BB:CC",
        IPAddresses: ["10.20.30.41"],
        SubnetMasks: ["255.255.255.0"],
        DefaultGateway: ["10.20.30.1"],
        DNSServers: ["10.20.30.10", "10.20.30.11"],
        DHCPEnabled: false,
        DNSDomain: "example.local",
      },
    ],
  },
  RolesAndFeatures: [
    { Name: "Web-Server",        DisplayName: "Web Server (IIS)", FeatureType: "Role" },
    { Name: "RDS-Licensing",     DisplayName: "Remote Desktop Licensing", FeatureType: "Role Service" },
    { Name: "FileAndStorage-Services", DisplayName: "File and Storage Services", FeatureType: "Role" },
  ],
  PendingReboot: { PendingReboot: false, Signals: [] },
  Activation: {
    Name: "Windows(R), ServerStandard edition",
    LicenseStatus: "Licensed",
    PartialProductKey: "XXXXX",
  },
};

export const DEMO_WORKLOAD: WorkloadDoc = {
  Metadata: {
    CollectorName: "collect-workload-profile",
    CollectorVersion: "0.1.0",
    CollectedAt: "2026-05-15T09:21:48.000Z",
    CollectedBy: "EXAMPLE\\svc.audit",
    Hostname: "HOST-DEMO-01",
    DurationSeconds: 18.7,
    SchemaVersion: "0.1.0",
    Parameters: { LargeStorageThresholdGB: 500 },
  },
  FindingsSummary: { Total: 4, Blockers: 1, Warnings: 2, Info: 1 },
  Findings: [
    {
      Severity: "BLOCKER",
      Category: "RDSLicensing",
      Message:
        "RDS Licensing role is installed but no CALs are issued. Users will hit grace-period expiry inside 120 days.",
      Evidence: { LicenseServer: "HOST-DEMO-01", IssuedCALs: 0, AvailableCALs: 0, Mode: "PerUser" },
    },
    {
      Severity: "WARN",
      Category: "IIS32Bit",
      Message:
        "2 IIS application pools run in 32-bit mode (enable32BitAppOnWin64=true). Migration target must preserve 32-bit support or apps need refactoring.",
      Evidence: [
        { Name: "LegacyAppPool", ManagedRuntimeVersion: "v4.0", Enable32Bit: true },
        { Name: "InvoicePool",   ManagedRuntimeVersion: "v4.0", Enable32Bit: true },
      ],
    },
    {
      Severity: "WARN",
      Category: "StorageVolume",
      Message:
        "Volume D: holds 1024GB allocated, 932GB used (91% full). Right-size cloud target with growth headroom.",
      Evidence: { DriveLetter: "D:", SizeGB: 1024, FreeGB: 92, FreePercent: 9 },
    },
    {
      Severity: "INFO",
      Category: "DomainController",
      Message:
        "Server is a member of example.local but not a Domain Controller. AAD Connect deployment can run on a separate host.",
      Evidence: { Domain: "example.local", DomainRole: 3 },
    },
  ],
  IsDomainController: false,
  InstalledApps: [
    { DisplayName: "Microsoft Visual C++ 2015-2022 Redistributable (x64)", DisplayVersion: "14.36.32532", Publisher: "Microsoft Corporation" },
    { DisplayName: "Internal Invoice App",                                 DisplayVersion: "3.7.1",       Publisher: "Example Software Ltd" },
    { DisplayName: "Sage 50 Accounts",                                     DisplayVersion: "v28",         Publisher: "Sage" },
  ],
  SQLServer: [],
  DotNetVersions: [
    { Version: "4.8",  ReleaseValue: 528449 },
    { Version: "3.5",  Installed: true },
  ],
  VCRuntimes: [
    { DisplayName: "Microsoft Visual C++ 2015-2022 Redistributable (x64)", DisplayVersion: "14.36.32532" },
  ],
  ODBC: { SystemDSNs: [], UserDSNs: [] },
  SMBShares: [
    { Name: "Invoices$", Path: "D:\\Invoices", Description: "Finance share", AccessControlList: ["EXAMPLE\\Finance: Modify"] },
  ],
  PrintQueues: [],
  Services: [
    { Name: "BLSAgent",   DisplayName: "BLS Monitoring Agent", StartName: "EXAMPLE\\svc.bls",    StartMode: "Auto", State: "Running" },
    { Name: "InvoiceSvc", DisplayName: "Invoice Worker",       StartName: "LocalSystem",         StartMode: "Auto", State: "Running" },
  ],
  ScheduledTasks: [
    { TaskName: "Backup-Invoices", State: "Ready", Author: "EXAMPLE\\svc.audit", LastRunTime: "2026-05-14T22:00:00" },
  ],
  ListeningPorts: [
    { LocalAddress: "0.0.0.0", LocalPort: 80,   Process: "w3wp" },
    { LocalAddress: "0.0.0.0", LocalPort: 443,  Process: "w3wp" },
    { LocalAddress: "0.0.0.0", LocalPort: 3389, Process: "svchost (TermService)" },
  ],
  IIS: {
    Sites: [
      { Name: "Default Web Site", Bindings: ["http/*:80:", "https/*:443:"], State: "Started" },
      { Name: "InvoiceApp",       Bindings: ["http/*:8080:"],               State: "Started" },
    ],
    AppPools: [
      { Name: "LegacyAppPool", ManagedRuntimeVersion: "v4.0", Enable32Bit: true,  State: "Started" },
      { Name: "InvoicePool",   ManagedRuntimeVersion: "v4.0", Enable32Bit: true,  State: "Started" },
      { Name: "DefaultAppPool", ManagedRuntimeVersion: "v4.0", Enable32Bit: false, State: "Started" },
    ],
  },
  RDSLicensing: {
    Installed: true,
    LicenseServer: "HOST-DEMO-01",
    Mode: "PerUser",
    IssuedCALs: 0,
    AvailableCALs: 0,
  },
  StorageVolumes: [
    { DriveLetter: "D:", SizeGB: 1024, FreeGB: 92,  FreePercent: 9  },
    { DriveLetter: "E:", SizeGB: 2048, FreeGB: 410, FreePercent: 20 },
  ],
};
