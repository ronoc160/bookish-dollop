import type {
  Monitor,
  MonitorType,
  UptimeRecord,
  UptimeStats,
  DailyUptimeSummary,
  MonitorTypeBreakdown,
  StatusBreakdown,
  DashboardKPIs,
} from '../types';

// Helper to generate dates
const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const generateTimestamp = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

// Mock Monitors
export const monitors: Monitor[] = [
  {
    id: 'mon-001',
    name: 'Production API',
    type: 'http',
    status: 'up',
    url: 'https://api.example.com/health',
    checkInterval: 60,
    timeout: 30,
    createdAt: generateDate(90),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'api', 'critical'],
  },
  {
    id: 'mon-002',
    name: 'Main Website',
    type: 'http',
    status: 'up',
    url: 'https://www.example.com',
    checkInterval: 60,
    timeout: 30,
    createdAt: generateDate(120),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'frontend'],
  },
  {
    id: 'mon-003',
    name: 'Database Server',
    type: 'tcp',
    status: 'up',
    host: 'db.internal.example.com',
    port: 5432,
    checkInterval: 30,
    timeout: 10,
    createdAt: generateDate(60),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'database', 'critical'],
  },
  {
    id: 'mon-004',
    name: 'Redis Cache',
    type: 'tcp',
    status: 'up',
    host: 'redis.internal.example.com',
    port: 6379,
    checkInterval: 30,
    timeout: 10,
    createdAt: generateDate(45),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'cache'],
  },
  {
    id: 'mon-005',
    name: 'Mail Server',
    type: 'tcp',
    status: 'down',
    host: 'mail.example.com',
    port: 587,
    checkInterval: 60,
    timeout: 30,
    createdAt: generateDate(30),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'email'],
  },
  {
    id: 'mon-006',
    name: 'CDN Endpoint',
    type: 'http',
    status: 'up',
    url: 'https://cdn.example.com/health',
    checkInterval: 120,
    timeout: 30,
    createdAt: generateDate(75),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'cdn'],
  },
  {
    id: 'mon-007',
    name: 'Payment Gateway',
    type: 'http',
    status: 'up',
    url: 'https://payments.example.com/api/status',
    checkInterval: 30,
    timeout: 15,
    createdAt: generateDate(100),
    lastCheckedAt: generateTimestamp(0),
    tags: ['production', 'payments', 'critical'],
  },
  {
    id: 'mon-008',
    name: 'Staging API',
    type: 'http',
    status: 'up',
    url: 'https://staging-api.example.com/health',
    checkInterval: 300,
    timeout: 30,
    createdAt: generateDate(20),
    lastCheckedAt: generateTimestamp(0),
    tags: ['staging', 'api'],
  },
  {
    id: 'mon-009',
    name: 'DNS Resolver',
    type: 'dns',
    status: 'up',
    host: 'example.com',
    checkInterval: 300,
    timeout: 30,
    createdAt: generateDate(50),
    lastCheckedAt: generateTimestamp(0),
    tags: ['infrastructure', 'dns'],
  },
  {
    id: 'mon-010',
    name: 'SSL Certificate',
    type: 'ssl',
    status: 'up',
    url: 'https://www.example.com',
    checkInterval: 3600,
    timeout: 30,
    createdAt: generateDate(80),
    lastCheckedAt: generateTimestamp(1),
    tags: ['security', 'ssl'],
  },
  {
    id: 'mon-011',
    name: 'Load Balancer',
    type: 'ping',
    status: 'up',
    host: 'lb.example.com',
    checkInterval: 60,
    timeout: 10,
    createdAt: generateDate(40),
    lastCheckedAt: generateTimestamp(0),
    tags: ['infrastructure', 'critical'],
  },
  {
    id: 'mon-012',
    name: 'Backup Server',
    type: 'ping',
    status: 'paused',
    host: 'backup.internal.example.com',
    checkInterval: 300,
    timeout: 30,
    createdAt: generateDate(25),
    lastCheckedAt: generateTimestamp(24),
    tags: ['infrastructure', 'backup'],
  },
];

// Generate uptime records for the last 30 days
const generateUptimeRecords = (monitorId: string, baseResponseTime: number, failureRate: number): UptimeRecord[] => {
  const records: UptimeRecord[] = [];
  const checksPerDay = 24; // One check per hour for simplicity

  for (let day = 29; day >= 0; day--) {
    for (let hour = 0; hour < checksPerDay; hour++) {
      const hoursAgo = day * 24 + (23 - hour);
      const isDown = Math.random() < failureRate;

      records.push({
        monitorId,
        timestamp: generateTimestamp(hoursAgo),
        status: isDown ? 'down' : 'up',
        responseTime: isDown ? 0 : baseResponseTime + Math.random() * 100 - 50,
        statusCode: isDown ? 500 : 200,
        errorMessage: isDown ? 'Connection timeout' : undefined,
      });
    }
  }

  return records;
};

// Generate uptime records for all monitors
export const uptimeRecords: UptimeRecord[] = [
  ...generateUptimeRecords('mon-001', 120, 0.01),
  ...generateUptimeRecords('mon-002', 250, 0.02),
  ...generateUptimeRecords('mon-003', 15, 0.005),
  ...generateUptimeRecords('mon-004', 8, 0.003),
  ...generateUptimeRecords('mon-005', 200, 0.15), // Mail server has issues
  ...generateUptimeRecords('mon-006', 80, 0.01),
  ...generateUptimeRecords('mon-007', 180, 0.008),
  ...generateUptimeRecords('mon-008', 300, 0.05),
  ...generateUptimeRecords('mon-009', 45, 0.002),
  ...generateUptimeRecords('mon-010', 350, 0.001),
  ...generateUptimeRecords('mon-011', 5, 0.004),
  ...generateUptimeRecords('mon-012', 25, 0.02),
];

// Calculate uptime stats for each monitor
export const calculateUptimeStats = (monitorId: string): UptimeStats => {
  const records = uptimeRecords.filter(r => r.monitorId === monitorId);
  const successfulChecks = records.filter(r => r.status === 'up').length;
  const failedChecks = records.filter(r => r.status === 'down').length;
  const totalChecks = records.length;

  const successfulRecords = records.filter(r => r.status === 'up');
  const averageResponseTime = successfulRecords.length > 0
    ? successfulRecords.reduce((sum, r) => sum + r.responseTime, 0) / successfulRecords.length
    : 0;

  const lastDownRecord = records.filter(r => r.status === 'down').sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  return {
    monitorId,
    uptimePercentage: totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0,
    averageResponseTime: Math.round(averageResponseTime),
    totalChecks,
    successfulChecks,
    failedChecks,
    lastDowntime: lastDownRecord?.timestamp,
  };
};

export const uptimeStats: UptimeStats[] = monitors.map(m => calculateUptimeStats(m.id));

// Calculate daily uptime summaries for the last 30 days
export const calculateDailyUptimeSummaries = (): DailyUptimeSummary[] => {
  const summaries: DailyUptimeSummary[] = [];

  for (let day = 29; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split('T')[0] ?? '';

    const dayStart = new Date(dateStr);
    const dayEnd = new Date(dateStr);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayRecords = uptimeRecords.filter(r => {
      const recordDate = new Date(r.timestamp);
      return recordDate >= dayStart && recordDate < dayEnd;
    });

    const successfulChecks = dayRecords.filter(r => r.status === 'up').length;
    const totalChecks = dayRecords.length;
    const incidents = dayRecords.filter(r => r.status === 'down').length;

    const successfulRecords = dayRecords.filter(r => r.status === 'up');
    const averageResponseTime = successfulRecords.length > 0
      ? successfulRecords.reduce((sum, r) => sum + r.responseTime, 0) / successfulRecords.length
      : 0;

    summaries.push({
      date: dateStr as string,
      uptimePercentage: totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0,
      averageResponseTime: Math.round(averageResponseTime),
      totalChecks,
      incidents,
    });
  }

  return summaries;
};

export const dailyUptimeSummaries: DailyUptimeSummary[] = calculateDailyUptimeSummaries();

// Calculate monitor type breakdown
const monitorTypes: MonitorType[] = ['http', 'tcp', 'ping', 'dns', 'ssl'];

export const monitorTypeBreakdown: MonitorTypeBreakdown[] = monitorTypes
  .map((type): MonitorTypeBreakdown => {
    const typeMonitors = monitors.filter(m => m.type === type);
    return {
      type,
      count: typeMonitors.length,
      upCount: typeMonitors.filter(m => m.status === 'up').length,
      downCount: typeMonitors.filter(m => m.status === 'down').length,
    };
  })
  .filter(b => b.count > 0);

// Calculate status breakdown
export const statusBreakdown: StatusBreakdown[] = (() => {
  const total = monitors.length;
  const statuses: Array<'up' | 'down' | 'pending' | 'paused'> = ['up', 'down', 'pending', 'paused'];

  return statuses.map(status => {
    const count = monitors.filter(m => m.status === status).length;
    return {
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    };
  }).filter(s => s.count > 0);
})();

// Calculate dashboard KPIs
export const dashboardKPIs: DashboardKPIs = {
  totalMonitors: monitors.length,
  monitorsUp: monitors.filter(m => m.status === 'up').length,
  monitorsDown: monitors.filter(m => m.status === 'down').length,
  overallUptime: uptimeStats.reduce((sum, s) => sum + s.uptimePercentage, 0) / uptimeStats.length,
  averageResponseTime: Math.round(
    uptimeStats.reduce((sum, s) => sum + s.averageResponseTime, 0) / uptimeStats.length
  ),
  activeIncidents: monitors.filter(m => m.status === 'down').length,
};
