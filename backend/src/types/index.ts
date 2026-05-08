export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  category?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalTools: number;
  availableTools: number;
  issuedTools: number;
  missingTools: number;
  recentTransactions: any[];
  latestScan: any;
}

export interface ScanResult {
  scannedIds: string[];
  matchedTools: string[];
  missingTools: string[];
  extraTools: string[];
  totalScanned: number;
  totalMatched: number;
  totalMissing: number;
  totalExtra: number;
}
