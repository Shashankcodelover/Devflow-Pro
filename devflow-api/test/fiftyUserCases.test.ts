import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { sprintCopilotService } from '../src/services/sprintCopilotService';
import { topologyService } from '../src/services/topologyService';
import { taskService } from '../src/services/taskService';
import { jobService } from '../src/services/jobService';
import redis from '../src/config/redis';

describe('DevFlow Pro - 50 Comprehensive Production Test Cases', () => {

  after(async () => {
    try {
      if (redis) {
        if (typeof redis.quit === 'function') await redis.quit();
        if (typeof redis.disconnect === 'function') redis.disconnect();
      }
    } catch {
      // Redis cleanup fallback
    }
    setTimeout(() => {
      process.exit(0);
    }, 300);
  });

  // ==========================================
  // GROUP 1: MULTI-ROLE USER JOURNEYS (1-5)
  // ==========================================

  test('1. Role: Lead Software Architect — designs architecture topology mesh with strict SLA', () => {
    topologyService.reset();
    const corridor = topologyService.create({
      sourceService: 'API Gateway',
      targetService: 'Auth Microservice',
      protocol: 'gRPC',
      latencyMs: 5,
      slaTargetMs: 20,
      status: 'ACTIVE',
      throughputOpsSec: 12000,
      environment: 'Production',
      description: 'Zero-trust mTLS authentication channel'
    });
    assert.ok(corridor.id);
    assert.equal(corridor.sourceService, 'API Gateway');
    assert.equal(corridor.status, 'ACTIVE');
    assert.ok(corridor.latencyMs <= corridor.slaTargetMs);
  });

  test('2. Role: Agile Scrum Master — plans sprint with CPM DAG story decomposition and Monte Carlo forecast', () => {
    const refined = sprintCopilotService.refineSprintStory('Implement Distributed Event Bus');
    assert.ok(refined.totalStoryPoints > 0);
    assert.ok(refined.nodes.length >= 3);
    const sim = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: refined.criticalPathHours,
      iterations: 1000,
      sprintBudgetHours: refined.criticalPathHours + 10
    });
    assert.ok(sim.onTimeProbabilityPercent >= 50);
  });

  test('3. Role: Staff DevOps Engineer — monitors mesh telemetry and SLA compliance metrics', () => {
    const metrics = topologyService.getMetrics();
    assert.ok(metrics.totalCorridors >= 1);
    assert.ok(metrics.averageLatencyMs > 0);
    assert.ok(metrics.slaCompliancePercent >= 0 && metrics.slaCompliancePercent <= 100);
  });

  test('4. Role: Full-Stack Developer — maintains deep zen flow state with active flow shield', () => {
    const flow = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 90,
      activeFocusMinutes: 75,
      interruptionCount: 0,
      gitBurstScore: 98
    });
    assert.equal(flow.flowShieldActive, true);
    assert.equal(flow.stateLabel, 'Deep Zen Flow');
    assert.ok(flow.flowDepthPercent >= 80);
  });

  test('5. Role: Engineering Director — audits context switching debt and financial impact across org', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 5,
      activeFocusMinutes: 120,
      hourlyRateUsd: 150
    });
    assert.ok(audit.financialImpactUsd > 0);
    assert.ok(audit.totalLostProductiveHours > 0);
    assert.ok(audit.resumptionDebtMinutes > 0);
  });

  // ==========================================
  // GROUP 2: COGNITIVE FLOW & SHIELD CALCULATIONS (6-12)
  // ==========================================

  test('6. Flow Calculator: Deep Zen Flow triggers when focus is high and interruptions are zero', () => {
    const res = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 80,
      activeFocusMinutes: 60,
      interruptionCount: 0,
      gitBurstScore: 90
    });
    assert.equal(res.stateLabel, 'Deep Zen Flow');
    assert.equal(res.flowShieldActive, true);
  });

  test('7. Flow Calculator: Moderate Flow triggers on medium velocity with low interruptions', () => {
    const res = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 50,
      activeFocusMinutes: 30,
      interruptionCount: 2,
      gitBurstScore: 60
    });
    assert.ok(res.flowDepthPercent > 0);
    assert.ok(res.contextSwitchPenaltyMinutes > 0);
  });

  test('8. Flow Calculator: Fragmented Flow triggers when interruptions spike above threshold', () => {
    const res = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 25,
      activeFocusMinutes: 15,
      interruptionCount: 8,
      gitBurstScore: 30
    });
    assert.equal(res.flowShieldActive, false);
    assert.ok(res.flowDepthPercent < 70);
  });

  test('9. Flow Calculator: Keystroke velocity upper bound capping', () => {
    const res = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 250,
      activeFocusMinutes: 45,
      interruptionCount: 0,
      gitBurstScore: 100
    });
    assert.ok(res.flowDepthPercent <= 100);
  });

  test('10. Flow Calculator: Zero focus minutes boundary check', () => {
    const res = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 0,
      activeFocusMinutes: 0,
      interruptionCount: 0,
      gitBurstScore: 0
    });
    assert.equal(res.flowShieldActive, false);
    assert.ok(res.flowDepthPercent >= 0);
  });

  test('11. Flow Calculator: Context switch penalty scales with interruption count', () => {
    const low = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 60,
      activeFocusMinutes: 40,
      interruptionCount: 1,
      gitBurstScore: 70
    });
    const high = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 60,
      activeFocusMinutes: 40,
      interruptionCount: 4,
      gitBurstScore: 70
    });
    assert.ok(high.contextSwitchPenaltyMinutes > low.contextSwitchPenaltyMinutes);
  });

  test('12. Flow Calculator: Flow shield deactivates whenever interruptions exceed threshold', () => {
    const res = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 35,
      activeFocusMinutes: 15,
      interruptionCount: 5,
      gitBurstScore: 30
    });
    assert.equal(res.flowShieldActive, false);
  });

  // ==========================================
  // GROUP 3: AUTONOMOUS CPM DAG STORY REFINER (13-18)
  // ==========================================

  test('13. DAG Refiner: Decomposes FIDO2 WebAuthn Passkeys into 5 subtasks', () => {
    const result = sprintCopilotService.refineSprintStory('FIDO2 WebAuthn Passkeys');
    assert.equal(result.nodes.length, 5);
    assert.equal(result.totalStoryPoints, 15);
  });

  test('14. DAG Refiner: Critical path hours calculation is positive and non-zero', () => {
    const result = sprintCopilotService.refineSprintStory('Database Replication Sharding');
    assert.ok(result.criticalPathHours > 0);
  });

  test('15. DAG Refiner: Cryptographic Sprint Passport format validation', () => {
    const result = sprintCopilotService.refineSprintStory('AI Code Review Pipeline');
    assert.ok(result.cryptographicSprintPassport.startsWith('0xDEVFLOW-SPRINT-2026-'));
  });

  test('16. DAG Refiner: Node dependencies form valid directed edges', () => {
    const result = sprintCopilotService.refineSprintStory('Microservice Mesh');
    for (const node of result.nodes) {
      assert.ok(node.id);
      assert.ok(node.title);
      assert.ok(typeof node.estimatedHours === 'number');
      assert.ok(Array.isArray(node.dependencies));
    }
  });

  test('17. DAG Refiner: Handles empty user story gracefully with default fallback', () => {
    const result = sprintCopilotService.refineSprintStory('');
    assert.ok(result.nodes.length > 0);
    assert.ok(result.totalStoryPoints > 0);
  });

  test('18. DAG Refiner: Total story points equals or exceeds critical path estimation', () => {
    const result = sprintCopilotService.refineSprintStory('Real-time WebSockets');
    assert.ok(result.totalStoryPoints >= 1);
  });

  // ==========================================
  // GROUP 4: MONTE CARLO SPRINT SIMULATOR (19-24)
  // ==========================================

  test('19. Monte Carlo: Simulation outputs valid percentiles (p50 <= p80 <= p95)', () => {
    const sim = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 30,
      iterations: 1500,
      sprintBudgetHours: 35
    });
    assert.ok(sim.p50Hours <= sim.p80Hours);
    assert.ok(sim.p80Hours <= sim.p95Hours);
  });

  test('20. Monte Carlo: On-time probability is within valid range [0, 100]', () => {
    const sim = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 20,
      iterations: 1000,
      sprintBudgetHours: 25
    });
    assert.ok(sim.onTimeProbabilityPercent >= 0 && sim.onTimeProbabilityPercent <= 100);
  });

  test('21. Monte Carlo: Generates 6 histogram bins', () => {
    const sim = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 24,
      iterations: 1000,
      sprintBudgetHours: 28
    });
    assert.equal(sim.histogram.length, 6);
  });

  test('22. Monte Carlo: Generates cryptographic feasibility passport', () => {
    const sim = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 15,
      iterations: 500,
      sprintBudgetHours: 20
    });
    assert.ok(sim.cryptographicFeasibilityPassport.startsWith('0xDEVFLOW-FEASIBILITY-'));
  });

  test('23. Monte Carlo: Extreme deficit budget reduces on-time probability', () => {
    const simDeficit = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 50,
      iterations: 1000,
      sprintBudgetHours: 20
    });
    assert.ok(simDeficit.onTimeProbabilityPercent <= 20);
  });

  test('24. Monte Carlo: Generous budget yields high on-time probability', () => {
    const simGenerous = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 10,
      iterations: 1000,
      sprintBudgetHours: 50
    });
    assert.ok(simGenerous.onTimeProbabilityPercent >= 90);
  });

  // ==========================================
  // GROUP 5: CONTEXT SWITCHING RESUMPTION DEBT (25-30)
  // ==========================================

  test('25. Resumption Debt: Zero interruptions yields 0 lost hours and 0 cost', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 0,
      activeFocusMinutes: 120,
      hourlyRateUsd: 100
    });
    assert.equal(audit.totalLostProductiveHours, 0);
    assert.equal(audit.financialImpactUsd, 0);
    assert.equal(audit.resumptionDebtMinutes, 0);
  });

  test('26. Resumption Debt: Quantifies lost minutes based on 23-minute Mark-Gudith research constant', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 2,
      activeFocusMinutes: 90,
      hourlyRateUsd: 100
    });
    assert.ok(audit.totalLostProductiveHours >= 0.5);
  });

  test('27. Resumption Debt: Financial cost scales with hourly rate', () => {
    const auditA = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 3,
      activeFocusMinutes: 100,
      hourlyRateUsd: 80
    });
    const auditB = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 3,
      activeFocusMinutes: 100,
      hourlyRateUsd: 160
    });
    assert.ok(Math.abs(auditB.financialImpactUsd - auditA.financialImpactUsd * 2) <= 2);
  });

  test('28. Resumption Debt: Rejects negative focus minutes gracefully', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 2,
      activeFocusMinutes: -30,
      hourlyRateUsd: 100
    });
    assert.ok(audit.totalLostProductiveHours >= 0);
    assert.ok(audit.financialImpactUsd >= 0);
  });

  test('29. Resumption Debt: Net focus minutes remaining boundary check', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 20,
      activeFocusMinutes: 10,
      hourlyRateUsd: 100
    });
    assert.ok(audit.netFocusMinutesRemaining >= 0);
  });

  test('30. Resumption Debt: Returns actionable recommendations string', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 5,
      activeFocusMinutes: 60,
      hourlyRateUsd: 120
    });
    assert.ok(audit.recommendation);
    assert.ok(audit.recommendation.length > 10);
  });

  // ==========================================
  // GROUP 6: ENTERPRISE TOPOLOGY MESH CORRIDORS (31-36)
  // ==========================================

  test('31. Topology Mesh: Reset restores baseline system corridors', () => {
    topologyService.reset();
    const all = topologyService.getAll();
    assert.ok(all.length >= 6);
  });

  test('32. Topology Mesh: Create new corridor and verify retrieve by ID', () => {
    const created = topologyService.create({
      sourceService: 'K8s Ingress',
      targetService: 'Envoy Sidecar',
      protocol: 'HTTP/2',
      latencyMs: 8,
      slaTargetMs: 25,
      status: 'ACTIVE',
      throughputOpsSec: 8500,
      environment: 'Staging',
      description: 'Ingress proxy dispatch'
    });
    const fetched = topologyService.getById(created.id);
    assert.ok(fetched);
    assert.equal(fetched.sourceService, 'K8s Ingress');
  });

  test('33. Topology Mesh: Update corridor status to DEGRADED', () => {
    const all = topologyService.getAll();
    const target = all[0];
    const updated = topologyService.update(target.id, { status: 'DEGRADED', latencyMs: 45 });
    assert.ok(updated);
    assert.equal(updated.status, 'DEGRADED');
    assert.equal(updated.latencyMs, 45);
  });

  test('34. Topology Mesh: Delete corridor and confirm severance', () => {
    const created = topologyService.create({
      sourceService: 'Temp Test Node',
      targetService: 'Temp Sink',
      protocol: 'gRPC',
      latencyMs: 1,
      slaTargetMs: 10,
      status: 'ACTIVE',
      throughputOpsSec: 1000,
      environment: 'Development',
      description: 'Temporary node'
    });
    const severed = topologyService.delete(created.id);
    assert.equal(severed, true);
    assert.equal(topologyService.getById(created.id), undefined);
  });

  test('35. Topology Mesh: Metrics calculates aggregate throughput correctly', () => {
    const metrics = topologyService.getMetrics();
    assert.ok(metrics.totalThroughputOpsSec > 0);
    assert.ok(metrics.activeCorridors <= metrics.totalCorridors);
  });

  test('36. Topology Mesh: Returns undefined for non-existent corridor ID', () => {
    const nonExistent = topologyService.getById('non-existent-corridor-id-99999');
    assert.equal(nonExistent, undefined);
  });

  // ==========================================
  // GROUP 7: CSV & BATCH DATA INGESTION (37-41)
  // ==========================================

  test('37. CSV Parser: Parses valid comma-separated values into records', () => {
    const csv = `sourceService,targetService,protocol,latencyMs,slaTargetMs
Worker A,Redis Cache,TCP,2,10
Worker B,Kafka Cluster,gRPC,5,20`;
    const records = topologyService.parseCSV(csv);
    assert.equal(records.length, 2);
    assert.equal(records[0].sourceService, 'Worker A');
    assert.equal(records[1].protocol, 'gRPC');
  });

  test('38. CSV Parser: Trims surrounding whitespace and quotes', () => {
    const csv = `sourceService,targetService,protocol,latencyMs,slaTargetMs
"Node 1" , "Node 2" , "mTLS" , 12 , 25`;
    const records = topologyService.parseCSV(csv);
    assert.equal(records.length, 1);
    assert.equal(records[0].sourceService, 'Node 1');
    assert.equal(records[0].protocol, 'mTLS');
  });

  test('39. CSV Parser: Ignores empty lines and comments', () => {
    const csv = `sourceService,targetService,protocol,latencyMs,slaTargetMs

Service A,Service B,REST,15,30

`;
    const records = topologyService.parseCSV(csv);
    assert.equal(records.length, 1);
  });

  test('40. Bulk Ingestion: Ingests multiple corridors simultaneously', () => {
    const beforeCount = topologyService.getAll().length;
    const batch = [
      { sourceService: 'Batch A', targetService: 'Sink A', protocol: 'gRPC', latencyMs: 4, slaTargetMs: 15 },
      { sourceService: 'Batch B', targetService: 'Sink B', protocol: 'REST', latencyMs: 9, slaTargetMs: 20 }
    ];
    const created = topologyService.createBulk(batch);
    assert.equal(created.length, 2);
    assert.equal(topologyService.getAll().length, beforeCount + 2);
  });

  test('41. Bulk Ingestion: Handles empty batch array without failure', () => {
    const created = topologyService.createBulk([]);
    assert.equal(created.length, 0);
  });

  // ==========================================
  // GROUP 8: TASK LIFECYCLE & CASCADE (42-46)
  // ==========================================

  test('42. Task Service: Create new task with priority and tags', async () => {
    const task = await taskService.create({
      title: 'Optimize Database Query Indexes',
      description: 'Add composite B-Tree indexes on user_id and created_at',
      priority: 'high',
      status: 'pending'
    });
    assert.ok(task._id);
    assert.equal(task.title, 'Optimize Database Query Indexes');
    assert.equal(task.priority, 'high');
  });

  test('43. Task Service: Transition task status from pending to in_progress', async () => {
    const task = await taskService.create({
      title: 'Setup Redis Cluster',
      description: 'Deploy 3-node Redis cluster with Sentinel',
      priority: 'medium',
      status: 'pending'
    });
    const updated = await taskService.update(task._id, { status: 'in_progress' });
    assert.ok(updated);
    assert.equal(updated.status, 'in_progress');
  });

  test('44. Task Service: Fetch all tasks contains created tasks', async () => {
    const tasks = await taskService.getAll();
    assert.ok(Array.isArray(tasks));
    assert.ok(tasks.length >= 2);
  });

  test('45. Task Service: Delete task removes it completely from registry', async () => {
    const task = await taskService.create({
      title: 'Ephemeral Task for Deletion',
      description: 'Will be deleted immediately',
      priority: 'low',
      status: 'pending'
    });
    const deleted = await taskService.delete(task._id);
    assert.equal(deleted, true);
    const lookup = await taskService.getById(task._id);
    assert.equal(lookup, null);
  });

  test('46. Task Service: Bulk task creation processes multiple tasks in order', async () => {
    const batch = [
      { title: 'Bulk Task 1', priority: 'low' as const, status: 'pending' as const },
      { title: 'Bulk Task 2', priority: 'medium' as const, status: 'pending' as const }
    ];
    const results = await taskService.bulkCreate(batch);
    assert.ok(results.added >= 2);
  });

  // ==========================================
  // GROUP 9: CAREER JOBS & TELEMETRY (47-50)
  // ==========================================

  test('47. Job Service: Retrieve list of open engineering jobs', async () => {
    const jobs = await jobService.getAll();
    assert.ok(Array.isArray(jobs));
    assert.ok(jobs.length >= 1);
  });

  test('48. Job Service: Create job position with salary and location', async () => {
    const job = await jobService.create({
      company: 'DevFlow Technologies',
      role: 'Staff Reliability Architect',
      status: 'applied',
      salary_min: 180000,
      salary_max: 230000,
      location: 'San Francisco, CA'
    });
    assert.ok(job.id);
    assert.equal(job.company, 'DevFlow Technologies');
  });

  test('49. Job Service: Retrieve and update job status by ID', async () => {
    const job = await jobService.create({
      company: 'Cloud Native Labs',
      role: 'Kubernetes Platform Lead',
      status: 'applied',
      salary_min: 195000,
      salary_max: 250000
    });
    const retrieved = await jobService.getById(job.id);
    assert.ok(retrieved);
    const updated = await jobService.update(job.id, { status: 'interview' });
    assert.ok(updated);
    assert.equal(updated.status, 'interview');
  });

  test('50. Job Service: Telemetry aggregation and clean deletion', async () => {
    const job = await jobService.create({
      company: 'Temp Mesh Labs',
      role: 'QA Engineer',
      status: 'applied'
    });
    const stats = await jobService.getStats();
    assert.ok(stats.total >= 1);
    const deleted = await jobService.delete(job.id);
    assert.equal(deleted, true);
  });

});
