export interface ArchitectureCorridor {
  id: string;
  sourceService: string;
  targetService: string;
  protocol: 'HTTP/REST' | 'gRPC' | 'WebSocket' | 'Kafka TCP' | 'mTLS' | 'Postgres Wire';
  latencyMs: number;
  slaTargetMs: number;
  status: 'ACTIVE' | 'STANDBY' | 'DEGRADED';
  throughputOpsSec: number;
  environment: 'Production' | 'Staging' | 'Sandbox' | 'Edge';
  description?: string;
  createdAt: string;
}

export interface TopologyMetrics {
  totalCorridors: number;
  activeCorridors: number;
  standbyCorridors: number;
  degradedCorridors: number;
  averageLatencyMs: number;
  totalThroughputOpsSec: number;
  slaCompliancePercent: number;
}

const INITIAL_CORRIDORS: ArchitectureCorridor[] = [
  {
    id: 'corridor-df-1',
    sourceService: 'DevFlow Client SPA',
    targetService: 'API Gateway & Reverse Proxy',
    protocol: 'HTTP/REST',
    latencyMs: 8,
    slaTargetMs: 25,
    status: 'ACTIVE',
    throughputOpsSec: 4200,
    environment: 'Production',
    description: 'TLS 1.3 edge ingress gateway routing authenticated REST/WebSocket telemetry',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'corridor-df-2',
    sourceService: 'API Gateway',
    targetService: 'Redis L2 Cache Cluster',
    protocol: 'gRPC',
    latencyMs: 2,
    slaTargetMs: 10,
    status: 'ACTIVE',
    throughputOpsSec: 8900,
    environment: 'Production',
    description: 'In-memory task state cache and sub-millisecond rate limiter token bucket',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'corridor-df-3',
    sourceService: 'API Gateway',
    targetService: 'PostgreSQL WAL Database',
    protocol: 'Postgres Wire',
    latencyMs: 14,
    slaTargetMs: 40,
    status: 'ACTIVE',
    throughputOpsSec: 1850,
    environment: 'Production',
    description: 'ACID transactional persistence for career jobs, user identity, and task ledgers',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'corridor-df-4',
    sourceService: 'API Gateway',
    targetService: 'Sprint Copilot V4.0 Engine',
    protocol: 'WebSocket',
    latencyMs: 5,
    slaTargetMs: 20,
    status: 'ACTIVE',
    throughputOpsSec: 3100,
    environment: 'Production',
    description: 'Bi-directional full-duplex socket for real-time keystroke WPM and focus state sync',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'corridor-df-5',
    sourceService: 'Sprint Copilot Engine',
    targetService: 'Kafka Event Log Streaming',
    protocol: 'Kafka TCP',
    latencyMs: 6,
    slaTargetMs: 30,
    status: 'ACTIVE',
    throughputOpsSec: 5400,
    environment: 'Production',
    description: 'High-throughput append-only event corridor for Mark-Gudith context switching metrics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'corridor-df-6',
    sourceService: 'API Gateway',
    targetService: 'WebAuthn Dual-Factor Vault',
    protocol: 'mTLS',
    latencyMs: 11,
    slaTargetMs: 35,
    status: 'STANDBY',
    throughputOpsSec: 650,
    environment: 'Production',
    description: 'Zero-trust cryptographic passkey identity assertion and Merkle passport validation',
    createdAt: new Date().toISOString(),
  },
];

let inMemoryCorridors: ArchitectureCorridor[] = [...INITIAL_CORRIDORS];

export const topologyService = {
  getAll(): ArchitectureCorridor[] {
    return inMemoryCorridors;
  },

  getById(id: string): ArchitectureCorridor | undefined {
    return inMemoryCorridors.find((c) => c.id === id);
  },

  create(data: Partial<ArchitectureCorridor>): ArchitectureCorridor {
    const newCorridor: ArchitectureCorridor = {
      id: data.id || `corridor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sourceService: data.sourceService || 'Frontend Service',
      targetService: data.targetService || 'Microservice Node',
      protocol: data.protocol || 'HTTP/REST',
      latencyMs: Number(data.latencyMs) || 10,
      slaTargetMs: Number(data.slaTargetMs) || 30,
      status: data.status || 'ACTIVE',
      throughputOpsSec: Number(data.throughputOpsSec) || 1000,
      environment: data.environment || 'Production',
      description: data.description || `${data.sourceService} to ${data.targetService} corridor`,
      createdAt: new Date().toISOString(),
    };

    inMemoryCorridors = [newCorridor, ...inMemoryCorridors];
    return newCorridor;
  },

  delete(id: string): boolean {
    const before = inMemoryCorridors.length;
    inMemoryCorridors = inMemoryCorridors.filter((c) => c.id !== id);
    return inMemoryCorridors.length < before;
  },

  bulkAdd(corridors: Partial<ArchitectureCorridor>[]): { added: number; total: number } {
    const created = corridors.map((c) => ({
      id: c.id || `corridor-bulk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sourceService: c.sourceService || 'Gateway Service',
      targetService: c.targetService || 'Target Node',
      protocol: c.protocol || 'gRPC',
      latencyMs: Number(c.latencyMs) || 12,
      slaTargetMs: Number(c.slaTargetMs) || 35,
      status: c.status || 'ACTIVE',
      throughputOpsSec: Number(c.throughputOpsSec) || 1200,
      environment: c.environment || 'Production',
      description: c.description || 'Bulk provisioned architecture corridor',
      createdAt: new Date().toISOString(),
    }));

    inMemoryCorridors = [...created, ...inMemoryCorridors];
    return { added: created.length, total: inMemoryCorridors.length };
  },

  getMetrics(): TopologyMetrics {
    const total = inMemoryCorridors.length;
    const active = inMemoryCorridors.filter((c) => c.status === 'ACTIVE').length;
    const standby = inMemoryCorridors.filter((c) => c.status === 'STANDBY').length;
    const degraded = inMemoryCorridors.filter((c) => c.status === 'DEGRADED').length;
    const avgLatency =
      total > 0 ? Math.round(inMemoryCorridors.reduce((acc, c) => acc + c.latencyMs, 0) / total) : 0;
    const totalThroughput = inMemoryCorridors.reduce(
      (acc, c) => acc + (c.status === 'ACTIVE' ? c.throughputOpsSec : 0),
      0
    );
    const compliant = inMemoryCorridors.filter((c) => c.latencyMs <= c.slaTargetMs).length;
    const slaCompliance = total > 0 ? Math.round((compliant / total) * 100) : 100;

    return {
      totalCorridors: total,
      activeCorridors: active,
      standbyCorridors: standby,
      degradedCorridors: degraded,
      averageLatencyMs: avgLatency,
      totalThroughputOpsSec: totalThroughput,
      slaCompliancePercent: slaCompliance,
    };
  },

  reset(): void {
    inMemoryCorridors = [...INITIAL_CORRIDORS];
  },

  parseCSV(csvText: string): Array<Record<string, string>> {
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const results: Array<Record<string, string>> = [];

    for (let i = 1; i < lines.length; i++) {
      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      const line = lines[i];

      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim().replace(/^["']|["']$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      row.push(current.trim().replace(/^["']|["']$/g, ''));

      if (row.length === headers.length) {
        const entry: Record<string, string> = {};
        headers.forEach((h, idx) => {
          entry[h] = row[idx] || '';
        });
        results.push(entry);
      }
    }

    return results;
  },
};
