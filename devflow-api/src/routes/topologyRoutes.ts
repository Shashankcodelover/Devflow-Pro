import { Router, Request, Response } from 'express';
import { topologyService, ArchitectureCorridor } from '../services/topologyService';

const router = Router();

// GET /api/topology - list corridors and metrics
router.get('/', (req: Request, res: Response) => {
  try {
    const corridors = topologyService.getAll();
    const metrics = topologyService.getMetrics();
    res.json({ success: true, count: corridors.length, corridors, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/topology/metrics
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = topologyService.getMetrics();
    res.json({ success: true, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/topology - provision new corridor
router.post('/', (req: Request, res: Response) => {
  try {
    const { sourceService, targetService } = req.body || {};
    if (!sourceService || !targetService) {
      res.status(400).json({ success: false, error: 'sourceService and targetService are required' });
      return;
    }

    const corridor = topologyService.create(req.body);
    const metrics = topologyService.getMetrics();
    res.status(201).json({ success: true, corridor, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/topology/:id - sever corridor
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = topologyService.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Corridor not found or already severed' });
      return;
    }
    const metrics = topologyService.getMetrics();
    res.json({
      success: true,
      message: `Corridor ${id} severed and de-allocated from live routing mesh`,
      severedId: id,
      metrics,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/topology/upload - batch ingest corridors (CSV & JSON)
router.post('/upload', (req: Request, res: Response) => {
  try {
    const contentType = req.headers['content-type'] || '';
    let parsed: Partial<ArchitectureCorridor>[] = [];

    if (contentType.includes('application/json')) {
      const body = req.body;
      const items = Array.isArray(body) ? body : body.corridors || [];
      parsed = items.map((item: any, idx: number) => ({
        id: item.id || `corridor-json-${Date.now()}-${idx}`,
        sourceService: item.sourceService || item.source || 'Gateway Service',
        targetService: item.targetService || item.target || 'Target Microservice',
        protocol: item.protocol || 'gRPC',
        latencyMs: Number(item.latencyMs) || 15,
        slaTargetMs: Number(item.slaTargetMs) || 40,
        status: item.status || 'ACTIVE',
        throughputOpsSec: Number(item.throughputOpsSec) || 2000,
        environment: item.environment || 'Production',
        description: item.description || 'JSON Batch provisioned corridor',
      }));
    } else {
      const rawText = typeof req.body === 'string' ? req.body : '';
      const rows = topologyService.parseCSV(rawText);
      parsed = rows.map((r, idx) => ({
        id: r.id || `corridor-csv-${Date.now()}-${idx}`,
        sourceService: r.sourceService || r.source || 'Gateway Service',
        targetService: r.targetService || r.target || 'Target Microservice',
        protocol: (r.protocol as any) || 'gRPC',
        latencyMs: parseInt(r.latencyMs, 10) || 15,
        slaTargetMs: parseInt(r.slaTargetMs, 10) || 40,
        status: (r.status as any) || 'ACTIVE',
        throughputOpsSec: parseInt(r.throughputOpsSec, 10) || 2000,
        environment: (r.environment as any) || 'Production',
        description: r.description || 'CSV Batch provisioned corridor',
      }));
    }

    if (parsed.length === 0) {
      res.status(400).json({ success: false, error: 'No valid corridor records found in payload' });
      return;
    }

    const result = topologyService.bulkAdd(parsed);
    const metrics = topologyService.getMetrics();
    res.json({
      success: true,
      message: `Successfully provisioned ${result.added} architecture corridors into live routing mesh`,
      addedCount: result.added,
      totalCount: result.total,
      corridors: parsed.slice(0, 5),
      metrics,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
