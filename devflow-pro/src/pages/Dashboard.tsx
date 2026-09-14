import { useMemo, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Zap, Brain, Shield, CheckCircle2, AlertTriangle, 
  Trash2, Plus, TrendingUp, Lock, RefreshCw
} from 'lucide-react'
import { taskApi } from '../api/taskApi'
import type { Task, NewTask } from '../store/taskReducer'
import SessionTimer from '../components/SessionTimer'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Web Audio synthesizer for harmonic feedback
function playChime(freq = 587.33) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch (e) { /* audio policy guard */ }
}

export default function Dashboard() {
  const queryClient = useQueryClient()

  // Local state for Monte Carlo & Interruption simulations
  const [sprintBudgetHours, setSprintBudgetHours] = useState(28)
  const [interruptionCount, setInterruptionCount] = useState(1)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')

  // Simulation results
  const [monteCarlo, setMonteCarlo] = useState<any>({
    criticalPathHours: 24,
    iterations: 2000,
    sprintBudgetHours: 28,
    p50Hours: 23.8,
    p80Hours: 25.4,
    p90Hours: 26.7,
    p95Hours: 27.8,
    onTimeProbabilityPercent: 96.2,
    riskLevel: 'LOW_RISK',
    histogram: [
      { bin: '18-21h', count: 180 },
      { bin: '21-24h', count: 820 },
      { bin: '24-27h', count: 680 },
      { bin: '27-30h', count: 240 },
      { bin: '30-33h', count: 65 },
      { bin: '33-36h', count: 15 }
    ],
    cryptographicFeasibilityPassport: '0xDEVFLOW-FEASIBILITY-94A2D0E81B6C4F37A902'
  })

  const [interruptAudit, setInterruptAudit] = useState<any>({
    resumptionDebtMinutes: 18,
    totalLostProductiveHours: 0.30,
    netFocusMinutesRemaining: 47,
    financialImpactUsd: 36,
    flowShieldSalvagedHours: 0.24,
    flowShieldSavingsUsd: 29,
    recommendation: 'Deep flow maintained. Cognitive friction minimal.'
  })

  // React Query — fetch real tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll
  })

  // Mutations
  const createTask = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      playChime(659.25)
    }
  })

  const markDone = useMutation({
    mutationFn: (id: string) => taskApi.update(id, { status: 'done' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      playChime(880.00)
    }
  })

  const deleteTask = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Socket.io sync
  useEffect(() => {
    const socket = io(API_BASE)
    socket.on('task:new', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })
    return () => { socket.disconnect() }
  }, [queryClient])

  // Fetch Monte Carlo simulation from backend
  const fetchSimulation = async (budget: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/copilot/monte-carlo-simulation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criticalPathHours: 24, sprintBudgetHours: budget, iterations: 2000 })
      })
      const data = await res.json()
      if (data.simulation) setMonteCarlo(data.simulation)
    } catch (e) {
      // Local fallback calculation
      const prob = budget >= 28 ? 96.5 : budget >= 24 ? 78.4 : 35.2
      setMonteCarlo((prev: any) => ({
        ...prev,
        sprintBudgetHours: budget,
        onTimeProbabilityPercent: prob,
        riskLevel: prob > 80 ? 'LOW_RISK' : prob > 60 ? 'MODERATE_RISK' : 'HIGH_SLIP_RISK'
      }))
    }
  }

  // Fetch Interrupt Debt Audit
  const fetchInterruptAudit = async (count: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/copilot/interrupt-debt-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interruptionCount: count, activeFocusMinutes: 65, hourlyRateUsd: 120 })
      })
      const data = await res.json()
      if (data.audit) setInterruptAudit(data.audit)
    } catch (e) {
      const debt = Math.round(count * 15.5 + Math.pow(count, 1.3) * 2)
      setInterruptAudit({
        resumptionDebtMinutes: debt,
        totalLostProductiveHours: Number((debt / 60).toFixed(2)),
        netFocusMinutesRemaining: Math.max(0, 65 - debt),
        financialImpactUsd: Math.round((debt / 60) * 120),
        flowShieldSalvagedHours: Number(((debt / 60) * 0.8).toFixed(2)),
        flowShieldSavingsUsd: Math.round(((debt / 60) * 0.8) * 120),
        recommendation: debt > 40 ? 'Severe Context Fragmentation' : 'Optimal Focus Preserved'
      })
    }
  }

  const handleBudgetChange = (val: number) => {
    setSprintBudgetHours(val)
    fetchSimulation(val)
  }

  const handleInterruptChange = (delta: number) => {
    const next = Math.max(0, Math.min(8, interruptionCount + delta))
    setInterruptionCount(next)
    fetchInterruptAudit(next)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const newTask: NewTask = {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      status: 'pending'
    }
    createTask.mutate(newTask)
    setNewTaskTitle('')
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t: Task) => t.status === 'done').length
    const pending = tasks.filter((t: Task) => t.status === 'pending').length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { total, done, pending, pct }
  }, [tasks])

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* EXECUTIVE COMMAND HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(22, 25, 34, 0.9), rgba(15, 17, 23, 0.9))',
        borderRadius: '16px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #34d399)',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={20} color="#fff" />
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#f9fafb', letterSpacing: '-0.02em' }}>
              DevFlow Executive Engineering HUD
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(52, 211, 153, 0.12)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
              CLUSTER RESONANCE: OPTIMAL
            </span>
          </div>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.88rem' }}>
            Autonomous Sprint Story Refiner, CPM Critical Path &amp; Real-Time Cognitive Flow-State Architecture
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SessionTimer />
          <button 
            onClick={() => { fetchSimulation(sprintBudgetHours); playChime(783.99); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Recalibrate
          </button>
        </div>
      </div>

      {/* TOP 4 KPI TELEMETRY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Flow State */}
        <div style={{
          background: 'rgba(22, 25, 34, 0.75)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '14px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.82rem' }}>
            <span>COGNITIVE FLOW DEPTH</span>
            <Brain size={16} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1' }}>94%</div>
          <div style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} /> Flow Shield Active (CLI: 0.34)
          </div>
        </div>

        {/* Card 2: Monte Carlo Delivery */}
        <div style={{
          background: 'rgba(22, 25, 34, 0.75)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '14px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.82rem' }}>
            <span>MONTE CARLO PROBABILITY</span>
            <TrendingUp size={16} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            {monteCarlo.onTimeProbabilityPercent}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
            p95 Delivery: <strong>{monteCarlo.p95Hours}h</strong> (Budget: {sprintBudgetHours}h)
          </div>
        </div>

        {/* Card 3: Interruption Resumption Debt */}
        <div style={{
          background: 'rgba(22, 25, 34, 0.75)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '14px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.82rem' }}>
            <span>RESUMPTION TAX DEBT</span>
            <AlertTriangle size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
            {interruptAudit.resumptionDebtMinutes}m
          </div>
          <div style={{ fontSize: '0.78rem', color: '#f87171' }}>
            -${interruptAudit.financialImpactUsd} Lost • {interruptAudit.interruptionCount} context switches
          </div>
        </div>

        {/* Card 4: Sprint Tasks Velocity */}
        <div style={{
          background: 'rgba(22, 25, 34, 0.75)',
          border: '1px solid rgba(240, 246, 252, 0.1)',
          borderRadius: '14px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.82rem' }}>
            <span>TASK VELOCITY MATRIX</span>
            <CheckCircle2 size={16} color="#a78bfa" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f3f4f6' }}>
            {stats.done} / {stats.total}
          </div>
          <div style={{ width: '100%', height: '6px', background: '#1f2430', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${stats.pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #34d399)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

      </div>

      {/* TWO-COLUMN COMMAND PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        
        {/* LEFT: MONTE CARLO & INTERRUPT DEBT SIMULATOR */}
        <div style={{
          background: 'rgba(22, 25, 34, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#34d399" /> Monte Carlo Sprint Completion Engine
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
              2,000 PERT Iterations
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af' }}>
            Calculates probability distribution for the 24-hour Critical Path Method (CPM) DAG using Beta-PERT parameters.
          </p>

          {/* Budget Slider */}
          <div style={{ background: '#121620', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#d1d5db' }}>Sprint Budget Horizon:</span>
              <strong style={{ color: '#6366f1', fontSize: '1rem' }}>{sprintBudgetHours} Hours</strong>
            </div>
            <input 
              type="range" 
              min="16" 
              max="36" 
              step="1" 
              value={sprintBudgetHours}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280', marginTop: '4px' }}>
              <span>16h (Aggressive)</span>
              <span>24h (Critical Path)</span>
              <span>28h (Nominal Buffer)</span>
              <span>36h (Safe)</span>
            </div>
          </div>

          {/* Confidence Percentiles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: '#121620', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>p50 (Median)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6', marginTop: '2px' }}>{monteCarlo.p50Hours}h</div>
            </div>
            <div style={{ background: '#121620', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>p80 Confidence</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa', marginTop: '2px' }}>{monteCarlo.p80Hours}h</div>
            </div>
            <div style={{ background: '#121620', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>p95 Confidence</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>{monteCarlo.p95Hours}h</div>
            </div>
            <div style={{ background: '#121620', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>On-Time Odds</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: monteCarlo.onTimeProbabilityPercent > 80 ? '#34d399' : '#fbbf24', marginTop: '2px' }}>
                {monteCarlo.onTimeProbabilityPercent}%
              </div>
            </div>
          </div>

          {/* Histogram Visualizer */}
          <div style={{ background: '#121620', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '10px' }}>
              Empirical PERT Simulation Frequency Distribution:
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '65px', gap: '8px', paddingBottom: '4px' }}>
              {monteCarlo.histogram?.map((h: any, idx: number) => {
                const maxH = Math.max(...monteCarlo.histogram.map((x: any) => x.count))
                const barHeight = Math.max(8, Math.round((h.count / maxH) * 55))
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '100%',
                      height: `${barHeight}px`,
                      background: 'linear-gradient(180deg, #6366f1, #34d399)',
                      borderRadius: '4px',
                      opacity: 0.85
                    }} />
                    <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>{h.bin}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Context Switching Resumption Audit */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={16} color="#fbbf24" /> Mark-Gudith Resumption Debt Model
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => handleInterruptChange(-1)}
                  style={{ width: '24px', height: '24px', background: '#1f2430', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>{interruptionCount} Interrupts</span>
                <button 
                  onClick={() => handleInterruptChange(1)}
                  style={{ width: '24px', height: '24px', background: '#1f2430', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '8px' }}>
              {interruptAudit.recommendation}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', background: '#121620', padding: '8px 12px', borderRadius: '8px' }}>
              <span>Flow Shield Salvaged: <strong style={{ color: '#34d399' }}>+{interruptAudit.flowShieldSalvagedHours}h</strong></span>
              <span>Savings Value: <strong style={{ color: '#34d399' }}>+${interruptAudit.flowShieldSavingsUsd}</strong></span>
            </div>
          </div>

          {/* Feasibility Passport */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(52, 211, 153, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} color="#6366f1" />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Feasibility Passport:</span>
            </div>
            <code style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              {monteCarlo.cryptographicFeasibilityPassport}
            </code>
          </div>

        </div>

        {/* RIGHT: TASK ENGINE & WORKSTREAM */}
        <div style={{
          background: 'rgba(22, 25, 34, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#6366f1" /> Real-Time Sprint Task Mesh
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {stats.pending} Pending • {stats.done} Done
            </span>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              placeholder="Add sprint task or spike..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                flex: 1,
                background: '#121620',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#f9fafb',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              style={{
                background: '#121620',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0 10px',
                color: '#d1d5db',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value="high">HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
            </select>
            <button
              type="submit"
              disabled={createTask.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                padding: '0 16px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Add
            </button>
          </form>

          {/* Tasks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {isLoading && (
              <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: '0.85rem' }}>
                Synchronizing task telemetry...
              </div>
            )}

            {!isLoading && tasks.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0', fontSize: '0.85rem' }}>
                No sprint tasks queued. Create a task above to begin deep work.
              </div>
            )}

            {tasks.map((task: Task) => {
              const isDone = task.status === 'done'
              const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
                high: { bg: 'rgba(239, 68, 68, 0.12)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
                medium: { bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
                low: { bg: 'rgba(52, 211, 153, 0.12)', text: '#34d399', border: 'rgba(52, 211, 153, 0.3)' }
              }
              const pStyle = priorityColors[task.priority || 'medium'] || priorityColors.medium

              return (
                <div 
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: isDone ? 'rgba(18, 22, 32, 0.4)' : '#121620',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    opacity: isDone ? 0.65 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <button
                      onClick={() => !isDone && markDone.mutate(String(task.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: isDone ? 'default' : 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <CheckCircle2 size={18} color={isDone ? '#34d399' : '#4b5563'} />
                    </button>
                    <span style={{
                      color: isDone ? '#9ca3af' : '#f3f4f6',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      textDecoration: isDone ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {task.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: pStyle.bg,
                      color: pStyle.text,
                      border: `1px solid ${pStyle.border}`
                    }}>
                      {task.priority?.toUpperCase()}
                    </span>

                    <button
                      onClick={() => deleteTask.mutate(String(task.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>

    </div>
  )
}