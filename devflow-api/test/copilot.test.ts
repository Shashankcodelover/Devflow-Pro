import { test, describe } from 'node:test'
import assert from 'node:assert'
import { sprintCopilotService } from '../src/services/sprintCopilotService'

describe('DevFlow Pro V4.0 Sprint Copilot Test Suite', () => {
  test('1. Cognitive Flow-State Calculator — computes flow depth and activates flow shield', () => {
    const metrics = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 85,
      activeFocusMinutes: 60,
      interruptionCount: 0,
      gitBurstScore: 95
    })

    assert.strictEqual(metrics.flowShieldActive, true)
    assert.strictEqual(metrics.stateLabel, 'Deep Zen Flow')
    assert.ok(metrics.flowDepthPercent >= 85)
    assert.strictEqual(metrics.contextSwitchPenaltyMinutes, 0)
  })

  test('2. Context Switching Degradation — penalizes flow depth when interruptions spike', () => {
    const metrics = sprintCopilotService.calculateFlowState({
      keystrokeVelocityWPM: 40,
      activeFocusMinutes: 20,
      interruptionCount: 5,
      gitBurstScore: 50
    })

    assert.strictEqual(metrics.flowShieldActive, false)
    assert.ok(metrics.contextSwitchPenaltyMinutes >= 20)
  })

  test('3. Autonomous CPM DAG Story Refiner — decomposes user story into acyclic nodes', () => {
    const result = sprintCopilotService.refineSprintStory('FIDO2 WebAuthn Passkeys')
    assert.strictEqual(result.totalStoryPoints, 15)
    assert.strictEqual(result.criticalPathHours, 24)
    assert.strictEqual(result.nodes.length, 5)
    assert.ok(result.cryptographicSprintPassport.startsWith('0xDEVFLOW-SPRINT-2026-'))
  })

  test('4. Monte Carlo Sprint Simulator — calculates PERT percentiles and on-time probability', () => {
    const sim = sprintCopilotService.runMonteCarloSimulation({
      criticalPathHours: 24,
      iterations: 2000,
      sprintBudgetHours: 28
    })
    assert.strictEqual(sim.criticalPathHours, 24)
    assert.strictEqual(sim.iterations, 2000)
    assert.ok(sim.p50Hours > 0)
    assert.ok(sim.p80Hours >= sim.p50Hours)
    assert.ok(sim.p95Hours >= sim.p80Hours)
    assert.ok(sim.onTimeProbabilityPercent >= 50)
    assert.strictEqual(sim.histogram.length, 6)
    assert.ok(sim.cryptographicFeasibilityPassport.startsWith('0xDEVFLOW-FEASIBILITY-'))
  })

  test('5. Context-Switching Resumption Debt Audit — quantifies lost time and financial impact (Mark-Gudith)', () => {
    const audit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 4,
      activeFocusMinutes: 90,
      hourlyRateUsd: 120
    })
    assert.strictEqual(audit.interruptionCount, 4)
    assert.ok(audit.resumptionDebtMinutes >= 60)
    assert.ok(audit.totalLostProductiveHours >= 1.0)
    assert.ok(audit.financialImpactUsd > 100)
    assert.ok(audit.flowShieldSavingsUsd > 0)
    assert.ok(audit.recommendation.includes('Fragmentation') || audit.recommendation.includes('Interruption'))
  })

  test('6. Zero Interruptions Edge Case — confirms optimal focus preservation with zero debt', () => {
    const cleanAudit = sprintCopilotService.auditInterruptDebt({
      interruptionCount: 0,
      activeFocusMinutes: 60,
      hourlyRateUsd: 120
    })
    assert.strictEqual(cleanAudit.interruptionCount, 0)
    assert.strictEqual(cleanAudit.resumptionDebtMinutes, 0)
    assert.strictEqual(cleanAudit.financialImpactUsd, 0)
    assert.ok(cleanAudit.recommendation.includes('minimal') || cleanAudit.recommendation.includes('maintained'))
  })
})

