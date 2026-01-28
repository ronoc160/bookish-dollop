// Monitor Types
export interface Monitor {
  id: string;
  name: string;
  type: MonitorType;
  status: MonitorStatus;
  url?: string;
  host?: string;
  port?: number;
  checkInterval: number; // in seconds
  timeout: number; // in seconds
  createdAt: string;
  lastCheckedAt: string;
  tags: string[];
}

export type MonitorType = 'http' | 'tcp' | 'ping' | 'dns' | 'ssl';
export type MonitorStatus = 'up' | 'down' | 'pending' | 'paused';

// Uptime Types
export interface UptimeRecord {
  monitorId: string;
  timestamp: string;
  status: 'up' | 'down';
  responseTime: number; // in ms
  statusCode?: number;
  errorMessage?: string;
}

export interface UptimeStats {
  monitorId: string;
  uptimePercentage: number;
  averageResponseTime: number;
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  lastDowntime?: string;
}

// Aggregated Data Types
export interface DailyUptimeSummary {
  date: string;
  uptimePercentage: number;
  averageResponseTime: number;
  totalChecks: number;
  incidents: number;
}

export interface MonitorTypeBreakdown {
  type: MonitorType;
  count: number;
  upCount: number;
  downCount: number;
}

export interface StatusBreakdown {
  status: MonitorStatus;
  count: number;
  percentage: number;
}

// Dashboard KPI Types
export interface DashboardKPIs {
  totalMonitors: number;
  monitorsUp: number;
  monitorsDown: number;
  overallUptime: number;
  averageResponseTime: number;
  activeIncidents: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Widget State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface WidgetState<T> {
  data: T | null;
  state: LoadingState;
  error: string | null;
}
