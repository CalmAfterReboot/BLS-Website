export type Severity = "BLOCKER" | "WARN" | "INFO";
export type CollectorName = "collect-server-inventory" | "collect-workload-profile";

export interface CollectorMetadata {
  CollectorName: CollectorName;
  CollectorVersion?: string;
  CollectedAt?: string;
  CollectedBy?: string;
  Hostname?: string;
  DurationSeconds?: number;
  SchemaVersion?: string;
  // Workload-only
  Parameters?: Record<string, unknown>;
}

export interface Finding {
  Severity: Severity;
  Category: string;
  Message: string;
  Evidence?: unknown;
}

export interface FindingsSummary {
  Total: number;
  Blockers: number;
  Warnings: number;
  Info: number;
}

export interface InventoryDoc {
  Metadata: CollectorMetadata;
  OperatingSystem?: Record<string, unknown> | null;
  Hardware?: Record<string, unknown> | null;
  Volumes?: Array<Record<string, unknown>> | null;
  Network?: Record<string, unknown> | null;
  RolesAndFeatures?: Array<Record<string, unknown>> | null;
  PendingReboot?: Record<string, unknown> | null;
  Activation?: Record<string, unknown> | null;
}

export interface WorkloadDoc {
  Metadata: CollectorMetadata;
  FindingsSummary: FindingsSummary;
  Findings: Finding[];
  IsDomainController?: boolean | null;
  InstalledApps?: Array<Record<string, unknown>> | null;
  SQLServer?: Array<Record<string, unknown>> | null;
  DotNetVersions?: Array<Record<string, unknown>> | null;
  VCRuntimes?: Array<Record<string, unknown>> | null;
  ODBC?: unknown;
  SMBShares?: unknown;
  PrintQueues?: Array<Record<string, unknown>> | null;
  Services?: Array<Record<string, unknown>> | null;
  ScheduledTasks?: Array<Record<string, unknown>> | null;
  ListeningPorts?: Array<Record<string, unknown>> | null;
  IIS?: Record<string, unknown> | null;
  RDSLicensing?: Record<string, unknown> | null;
  StorageVolumes?: Array<Record<string, unknown>> | null;
}

export interface HostBundle {
  hostname: string;
  inventory?: InventoryDoc;
  workload?: WorkloadDoc;
}

export type AnyDoc = InventoryDoc | WorkloadDoc;
