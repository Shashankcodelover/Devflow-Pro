import test from 'node:test';
import assert from 'node:assert/strict';
import { topologyService } from '../src/services/topologyService';
import { taskService } from '../src/services/taskService';
import { jobService } from '../src/services/jobService';

test('DevFlow Pro Enterprise Fleet: CSV Parsing Utility', () => {
  const csv = `sourceService,targetService,protocol,latencyMs,slaTargetMs
DevFlow Gateway,Auth0 FIDO2,mTLS,14,30
Task Worker,RabbitMQ Cluster,gRPC,4,15`;

  const rows = topologyService.parseCSV(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].sourceService, 'DevFlow Gateway');
  assert.equal(rows[0].protocol, 'mTLS');
  assert.equal(rows[1].targetService, 'RabbitMQ Cluster');
});

test('DevFlow Pro Enterprise Fleet: Architecture Topology Mesh Corridors', () => {
  topologyService.reset();
  const initialCount = topologyService.getAll().length;
  assert.equal(initialCount >= 6, true);

  // Provision new corridor
  const newCorridor = topologyService.create({
    sourceService: 'DevFlow Edge Worker',
    targetService: 'Redis L2 Cache',
    protocol: 'gRPC',
    latencyMs: 3,
    slaTargetMs: 15,
    status: 'ACTIVE',
    throughputOpsSec: 7500,
    environment: 'Production',
    description: 'Ultra-low latency edge session validator',
  });

  assert.equal(topologyService.getAll().length, initialCount + 1);
  assert.equal(newCorridor.sourceService, 'DevFlow Edge Worker');

  // Verify Metrics
  const metrics = topologyService.getMetrics();
  assert.equal(metrics.totalCorridors >= 7, true);
  assert.equal(metrics.activeCorridors >= 5, true);
  assert.equal(metrics.averageLatencyMs > 0, true);
  assert.equal(metrics.totalThroughputOpsSec > 10000, true);
  assert.equal(metrics.slaCompliancePercent >= 80, true);

  // Sever Link
  const severed = topologyService.delete(newCorridor.id);
  assert.equal(severed, true);
  assert.equal(topologyService.getById(newCorridor.id), undefined);
});

test('DevFlow Pro Enterprise Fleet: Bulk Corridor Upload (JSON & CSV)', () => {
  const batch = [
    {
      sourceService: 'Telemetry Pod',
      targetService: 'Prometheus TSDB',
      protocol: 'HTTP/REST' as const,
      latencyMs: 12,
      slaTargetMs: 40,
    },
    {
      sourceService: 'Notification Worker',
      targetService: 'SendGrid Dispatcher',
      protocol: 'mTLS' as const,
      latencyMs: 28,
      slaTargetMs: 80,
    },
  ];

  const result = topologyService.bulkAdd(batch);
  assert.equal(result.added, 2);
});

test('DevFlow Pro Enterprise Fleet: Task Lifecycle & Cascading Deletion', async () => {
  const newTask = await taskService.create({
    title: 'Enterprise End-to-End Test Task',
    priority: 'high',
    status: 'pending',
  });

  assert.equal(newTask.title, 'Enterprise End-to-End Test Task');

  // Verify in list
  const allTasks = await taskService.getAll();
  assert.equal(allTasks.some((t: any) => (t._id || t.id) === (newTask as any)._id), true);

  // Update
  const updated = await taskService.update((newTask as any)._id, { status: 'done' });
  assert.equal(updated?.status, 'done');

  // Delete with cascade
  const deleted = await taskService.delete((newTask as any)._id);
  assert.equal(deleted, true);
});

test('DevFlow Pro Enterprise Fleet: Task Bulk Ingestion', async () => {
  const batch = [
    { title: 'Refactor Auth Token Rotation', priority: 'high' as const, status: 'pending' as const },
    { title: 'Optimize WebGL Canvas Pipeline', priority: 'medium' as const, status: 'done' as const },
  ];

  const result = await taskService.bulkCreate(batch);
  assert.equal(result.added, 2);
  assert.equal(result.total >= 2, true);
});

test('DevFlow Pro Enterprise Fleet: Career Job Application Ingestion & Deletion', async () => {
  const initial = await jobService.getAll();

  const newJob = await jobService.create({
    company: 'OpenAI',
    role: 'Infrastructure Platform Engineer',
    status: 'interview',
    salary_min: 250000,
    salary_max: 340000,
    location: 'San Francisco, CA',
  });

  assert.equal(newJob.company, 'OpenAI');
  assert.equal(newJob.status, 'interview');

  // Verify Stats
  const stats: any = await jobService.getStats();
  assert.equal(Number(stats.total) >= 1, true);

  // Bulk Ingestion
  const bulkResult = await jobService.bulkCreate([
    {
      company: 'Databricks',
      role: 'Core Runtime Engineer',
      status: 'applied',
      salary_min: 220000,
      salary_max: 290000,
      location: 'Mountain View, CA',
    },
  ]);
  assert.equal(bulkResult.added, 1);

  // Cascading deletion
  const deleted = await jobService.delete(newJob.id);
  assert.equal(deleted, true);
});
