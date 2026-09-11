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
})
