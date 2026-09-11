import { Router, Request, Response } from 'express'
import { sprintCopilotService, FlowStateTelemetry } from '../services/sprintCopilotService'

const router = Router()

/**
 * GET /api/copilot/status
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'ACTIVE',
    version: '4.0.0-PROD',
    engine: 'DevFlow Pro Cognitive Flow-State & CPM DAG Sprint Copilot',
    algorithms: ['Critical Path Method (CPM)', 'Cognitive Load Index (CLI)', 'Dual-Factor Merkle Passports']
  })
})

/**
 * GET /api/copilot/flow-state
 */
router.get('/flow-state', (req: Request, res: Response) => {
  const telemetry: FlowStateTelemetry = {
    keystrokeVelocityWPM: 78,
    activeFocusMinutes: 62,
    interruptionCount: 0,
    gitBurstScore: 92
  }
  const metrics = sprintCopilotService.calculateFlowState(telemetry)
  res.json({
    success: true,
    telemetry,
    metrics
  })
})

/**
 * POST /api/copilot/flow-telemetry
 */
router.post('/flow-telemetry', (req: Request, res: Response) => {
  const { keystrokeVelocityWPM = 60, activeFocusMinutes = 30, interruptionCount = 1, gitBurstScore = 80 } = req.body || {}
  const telemetry: FlowStateTelemetry = {
    keystrokeVelocityWPM: Number(keystrokeVelocityWPM),
    activeFocusMinutes: Number(activeFocusMinutes),
    interruptionCount: Number(interruptionCount),
    gitBurstScore: Number(gitBurstScore)
  }
  const metrics = sprintCopilotService.calculateFlowState(telemetry)
  res.json({
    success: true,
    telemetry,
    metrics
  })
})

/**
 * POST /api/copilot/refine-story
 */
router.post('/refine-story', (req: Request, res: Response) => {
  const { requirement = 'FIDO2 Passkey & WebAuthn Sovereign Authentication Architecture' } = req.body || {}
  const result = sprintCopilotService.refineSprintStory(requirement)
  res.json({
    success: true,
    result
  })
})

export default router
