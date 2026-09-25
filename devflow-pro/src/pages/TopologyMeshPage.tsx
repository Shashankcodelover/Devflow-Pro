import { useState, useEffect } from 'react';
import {
  Network,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  Filter,
  Search,
  ArrowRight,
  Radio,
  Clock,
  Layers,
  X,
} from 'lucide-react';
import axios from 'axios';

interface ArchitectureCorridor {
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

const AVAILABLE_SERVICES = [
  'DevFlow Client SPA',
  'API Gateway & Reverse Proxy',
  'Redis L2 Cache Cluster',
  'PostgreSQL WAL Database',
  'Sprint Copilot V4.0 Engine',
  'Kafka Event Log Streaming',
  'WebAuthn Dual-Factor Vault',
  'RabbitMQ Background Worker',
  'Prometheus Telemetry TSDB',
];

export default function TopologyMeshPage() {
  const [corridors, setCorridors] = useState<ArchitectureCorridor[]>(INITIAL_CORRIDORS);
  const [protocolFilter, setProtocolFilter] = useState<string>('All');
  const [envFilter, setEnvFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [sourceService, setSourceService] = useState('DevFlow Client SPA');
  const [targetService, setTargetService] = useState('Redis L2 Cache Cluster');
  const [protocol, setProtocol] = useState<ArchitectureCorridor['protocol']>('gRPC');
  const [latencyMs, setLatencyMs] = useState(6);
  const [slaTargetMs, setSlaTargetMs] = useState(25);
  const [throughputOpsSec, setThroughputOpsSec] = useState(3200);
  const [environment, setEnvironment] = useState<ArchitectureCorridor['environment']>('Production');
  const [description, setDescription] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCorridors = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/topology');
      if (res.data?.corridors && res.data.corridors.length > 0) {
        setCorridors(res.data.corridors);
      }
    } catch {
      // Keep initial corridors
    }
  };

  useEffect(() => {
    fetchCorridors();
  }, []);

  // Filter corridors
  const filteredCorridors = corridors.filter((c) => {
    if (protocolFilter !== 'All' && c.protocol !== protocolFilter) return false;
    if (envFilter !== 'All' && c.environment !== envFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.sourceService.toLowerCase().includes(q) ||
        c.targetService.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Metrics
  const total = corridors.length;
  const active = corridors.filter((c) => c.status === 'ACTIVE').length;
  const avgLatency =
    total > 0 ? Math.round(corridors.reduce((acc, c) => acc + c.latencyMs, 0) / total) : 0;
  const totalThroughput = corridors.reduce(
    (acc, c) => acc + (c.status === 'ACTIVE' ? c.throughputOpsSec : 0),
    0
  );
  const slaCompliance =
    total > 0
      ? Math.round(
          (corridors.filter((c) => c.latencyMs <= c.slaTargetMs).length / total) * 100
        )
      : 100;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceService === targetService) {
      showToast('⚠️ Source and Target microservices cannot be identical');
      return;
    }

    const newCorridor: ArchitectureCorridor = {
      id: `corridor-${Date.now()}`,
      sourceService,
      targetService,
      protocol,
      latencyMs: Number(latencyMs),
      slaTargetMs: Number(slaTargetMs),
      status: 'ACTIVE',
      throughputOpsSec: Number(throughputOpsSec),
      environment,
      description:
        description.trim() || `${sourceService} to ${targetService} optimized ${protocol} corridor`,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:3001/api/topology', newCorridor);
    } catch {
      // client update
    }

    setCorridors((prev) => [newCorridor, ...prev]);
    showToast(`⚡ Corridor provisioned: ${sourceService} ➔ ${targetService}`);
    setIsModalOpen(false);
    setDescription('');
  };

  const handleSever = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to sever the active architecture corridor [${label}]?`)) return;

    try {
      await axios.delete(`http://localhost:3001/api/topology/${id}`);
    } catch {
      // client update
    }

    setCorridors((prev) => prev.filter((c) => c.id !== id));
    showToast(`✂️ Corridor severed: ${label}`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid #6366f1',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Zap size={16} color="#6366f1" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Architecture Topology Mesh V5.0
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Microservice Dependency Mesh</span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Network color="#6366f1" size={32} />
            System Architecture & Dependency Topology Mesh
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px', maxWidth: '680px' }}>
            Real-time telemetry, inter-service protocol channels, and live quality-of-service SLA compliance
            corridors with zero-downtime provisioning and instant link severing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={16} />
          <span>Provision Corridor</span>
        </button>
      </div>

      {/* KPI Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderLeft: '4px solid #6366f1',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
              Active Corridors
            </span>
            <Layers size={18} color="#6366f1" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{active}</span>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>/ {total} provisioned</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#10b981', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            Zero-partition cluster topology
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderLeft: '4px solid #10b981',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
              Mean Latency
            </span>
            <Clock size={18} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{avgLatency}</span>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>ms RTT</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#10b981', margin: '6px 0 0' }}>
            Target SLA: &lt; 20ms (Optimal)
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderLeft: '4px solid #06b6d4',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
              SLA Compliance
            </span>
            <ShieldCheck size={18} color="#06b6d4" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{slaCompliance}%</span>
            <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>zero-trust</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '6px 0 0' }}>
            Real-time automated failover
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
              System Throughput
            </span>
            <Zap size={18} color="#f59e0b" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{totalThroughput.toLocaleString()}</span>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>ops/sec</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6366f1', margin: '6px 0 0' }}>
            Active event stream load
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Protocol:
          </span>
          {['All', 'HTTP/REST', 'gRPC', 'WebSocket', 'Kafka TCP', 'mTLS', 'Postgres Wire'].map((proto) => (
            <button
              key={proto}
              onClick={() => setProtocolFilter(proto)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: protocolFilter === proto ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.15)',
                background: protocolFilter === proto ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                color: protocolFilter === proto ? '#a5b4fc' : '#9ca3af',
                cursor: 'pointer'
              }}
            >
              {proto}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', maxWidth: '440px' }}>
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="All">All Environments</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Edge">Edge</option>
            <option value="Sandbox">Sandbox</option>
          </select>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search architecture nodes..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Corridors Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={16} color="#6366f1" /> Active Topology Corridors ({filteredCorridors.length})
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Click Sever Link to permanently decouple topology path
          </span>
        </div>

        {filteredCorridors.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <Network size={40} color="#6b7280" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>No matching architecture corridors</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Adjust search queries or filters to view available links.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {filteredCorridors.map((c) => {
              const latencyPct = Math.min(Math.round((c.latencyMs / c.slaTargetMs) * 100), 100);
              const isDegraded = c.latencyMs > c.slaTargetMs;

              return (
                <div
                  key={c.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  {/* Top Bar: Nodes */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}>
                        {c.sourceService}
                      </span>
                      <ArrowRight size={14} color="#6b7280" />
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {c.targetService}
                      </span>
                    </div>

                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: c.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: c.status === 'ACTIVE' ? '#10b981' : '#f59e0b',
                      border: c.status === 'ACTIVE' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)'
                    }}>
                      {c.status}
                    </span>
                  </div>

                  {c.description && (
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                      {c.description}
                    </p>
                  )}

                  {/* Telemetry row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    textAlign: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', fontWeight: 700 }}>Protocol</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>{c.protocol}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', fontWeight: 700 }}>RTT Latency</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isDegraded ? '#ef4444' : '#10b981' }}>{c.latencyMs} ms</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#6b7280', display: 'block', fontWeight: 700 }}>Throughput</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>{c.throughputOpsSec} ops/s</span>
                    </div>
                  </div>

                  {/* SLA Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af', marginBottom: '4px' }}>
                      <span>SLA Budget: {c.latencyMs}ms / {c.slaTargetMs}ms</span>
                      <span>{latencyPct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.15)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${latencyPct}%`,
                        height: '100%',
                        borderRadius: '9999px',
                        background: latencyPct > 80 ? '#ef4444' : latencyPct > 50 ? '#f59e0b' : '#10b981',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', fontFamily: 'monospace' }}>
                      ID: {c.id}
                    </span>
                    <button
                      onClick={() => handleSever(c.id, `${c.sourceService} ➔ ${c.targetService}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Sever Link</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Provision Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 1000
        }}>
          <div style={{
            background: '#161922',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              Provision Architecture Dependency Corridor
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 20px' }}>
              Deploy low-latency inter-service routing corridor with SLA constraints.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Source Node</label>
                  <select
                    value={sourceService}
                    onChange={(e) => setSourceService(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  >
                    {AVAILABLE_SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Target Node</label>
                  <select
                    value={targetService}
                    onChange={(e) => setTargetService(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  >
                    {AVAILABLE_SERVICES.filter((s) => s !== sourceService).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Protocol Channel</label>
                  <select
                    value={protocol}
                    onChange={(e: any) => setProtocol(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="gRPC">gRPC (Binary RPC)</option>
                    <option value="HTTP/REST">HTTP/REST (Standard JSON)</option>
                    <option value="WebSocket">WebSocket (Full Duplex)</option>
                    <option value="Kafka TCP">Kafka TCP (Streaming)</option>
                    <option value="mTLS">mTLS (Zero Trust)</option>
                    <option value="Postgres Wire">Postgres Wire</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Environment</label>
                  <select
                    value={environment}
                    onChange={(e: any) => setEnvironment(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="Production">Production Cluster</option>
                    <option value="Staging">Staging Replica</option>
                    <option value="Edge">Edge Worker</option>
                    <option value="Sandbox">Sandbox</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Latency (ms)</label>
                  <input
                    type="number"
                    value={latencyMs}
                    onChange={(e) => setLatencyMs(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>SLA Target (ms)</label>
                  <input
                    type="number"
                    value={slaTargetMs}
                    onChange={(e) => setSlaTargetMs(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Ops/sec</label>
                  <input
                    type="number"
                    value={throughputOpsSec}
                    onChange={(e) => setThroughputOpsSec(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Corridor Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Dedicated high-urgency fallback corridor"
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#0f1117', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.15)', color: '#9ca3af', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  Deploy Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
