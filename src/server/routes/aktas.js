import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { aktas as aktasTable, progressHistory, aktaTemplates } from '../../lib/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import { authenticate } from '../middleware/auth.js';
import { generateDocument } from '../../lib/documentGenerator.js';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

const aktas = new Hono();

export function generateTrackingCode() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AKT-${year}-${random}`;
}

aktas.get('/track/:code', async (c) => {
  try {
    const code = c.req.param('code');

    const akta = await db.query.aktas.findFirst({
      where: eq(aktasTable.trackingCode, code),
    });

    if (!akta) {
      return c.json({ error: 'Akta not found' }, 404);
    }

    const history = await db.query.progressHistory.findMany({
      where: eq(progressHistory.aktaId, akta.id),
      orderBy: [desc(progressHistory.createdAt)]
    });

    return c.json({
      trackingCode: akta.trackingCode,
      aktaType: akta.aktaType,
      status: akta.status,
      progress: akta.progress,
      currentStage: akta.currentStage,
      timeline: history.map(h => ({
        stageName: h.stageName,
        status: h.status,
        notes: h.notes,
        createdAt: h.createdAt
      }))
    });
  } catch (error) {
    console.error('Track akta error:', error);
    return c.json({ error: 'Failed to track akta' }, 500);
  }
});

aktas.get('/', authenticate, async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = parseInt(c.req.query('limit')) || 10;
    const status = c.req.query('status');
    const aktaType = c.req.query('aktaType');
    const search = c.req.query('search');

    const whereConditions = [];

    if (status) whereConditions.push(eq(aktasTable.status, status));
    if (aktaType) whereConditions.push(eq(aktasTable.aktaType, aktaType));

    const offset = (page - 1) * limit;

    const allAktas = await db.query.aktas.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(aktasTable.createdAt)],
      limit,
      offset
    });

    let filtered = allAktas;
    if (search) {
      const s = search.toLowerCase();
      filtered = allAktas.filter(a =>
        a.clientName?.toLowerCase().includes(s) ||
        a.trackingCode?.toLowerCase().includes(s) ||
        a.clientEmail?.toLowerCase().includes(s)
      );
    }

    const total = await db.$count(aktasTable, whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return c.json({
      aktas: filtered,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get aktas error:', error);
    return c.json({ error: 'Failed to get aktas' }, 500);
  }
});

aktas.get('/:id', authenticate, async (c) => {
  try {
    const id = c.req.param('id');
    const akta = await db.query.aktas.findFirst({
      where: eq(aktasTable.id, id),
      with: {
        progressHistory: { orderBy: [desc(progressHistory.createdAt)] }
      }
    });
    if (!akta) return c.json({ error: 'Akta not found' }, 404);
    return c.json({ akta });
  } catch (error) {
    console.error('Get akta error:', error);
    return c.json({ error: 'Failed to get akta' }, 500);
  }
});

aktas.post('/', authenticate, zValidator('json', z.object({
  aktaType: z.string().min(2),
  clientId: z.string().min(2),
  clientName: z.string().min(2),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
  formData: z.record(z.any()),
  templateVersion: z.number().optional()
})), async (c) => {
  try {
    const data = c.req.valid('json');

    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.aktaType, data.aktaType)
    });
    if (!template) return c.json({ error: 'Template not found for this akta type' }, 404);

    const aktaId = crypto.randomUUID();
    const trackingCode = generateTrackingCode();
    const firstStage = template.stages[0]?.id || 'draft';

    await db.insert(aktasTable).values({
      id: aktaId,
      aktaType: data.aktaType,
      clientId: data.clientId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      formData: data.formData,
      templateVersion: data.templateVersion || template.version,
      currentStage: firstStage,
      status: 'in_progress',
      progress: 0,
      trackingCode
    });

    await db.insert(progressHistory).values({
      id: crypto.randomUUID(),
      aktaId: aktaId,
      stageId: firstStage,
      stageName: template.stages[0]?.name || 'Draft',
      status: 'started',
      notes: 'Akta created'
    });

    const akta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, aktaId) });

    return c.json({ message: 'Akta created successfully', akta }, 201);
  } catch (error) {
    console.error('Create akta error:', error);
    return c.json({ error: 'Failed to create akta' }, 500);
  }
});

aktas.put('/:id', authenticate, zValidator('json', z.object({
  clientName: z.string().min(2).optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
  formData: z.record(z.any()).optional(),
  status: z.enum(['draft', 'in_progress', 'review', 'completed', 'cancelled']).optional(),
  currentStage: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  notes: z.string().optional()
})), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');

    const existingAkta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    if (!existingAkta) return c.json({ error: 'Akta not found' }, 404);

    await db.update(aktasTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aktasTable.id, id));

    if (data.currentStage && data.currentStage !== existingAkta.currentStage) {
      const template = await db.query.aktaTemplates.findFirst({
        where: eq(aktaTemplates.aktaType, existingAkta.aktaType)
      });
      const currentStageInfo = template?.stages.find(s => s.id === data.currentStage);

      await db.insert(progressHistory).values({
        id: crypto.randomUUID(),
        aktaId: id,
        stageId: data.currentStage,
        stageName: currentStageInfo?.name || data.currentStage,
        status: 'started',
        notes: data.notes || `Moved to stage: ${currentStageInfo?.name || data.currentStage}`
      });
    }

    const akta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    return c.json({ message: 'Akta updated successfully', akta });
  } catch (error) {
    console.error('Update akta error:', error);
    return c.json({ error: 'Failed to update akta' }, 500);
  }
});

aktas.delete('/:id', authenticate, async (c) => {
  try {
    const id = c.req.param('id');
    const existingAkta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    if (!existingAkta) return c.json({ error: 'Akta not found' }, 404);

    await db.delete(progressHistory).where(eq(progressHistory.aktaId, id));
    await db.delete(aktasTable).where(eq(aktasTable.id, id));

    return c.json({ message: 'Akta deleted successfully' });
  } catch (error) {
    console.error('Delete akta error:', error);
    return c.json({ error: 'Failed to delete akta' }, 500);
  }
});

aktas.post('/:id/progress', authenticate, zValidator('json', z.object({
  stageId: z.string(),
  status: z.enum(['started', 'in_progress', 'completed', 'on_hold']),
  notes: z.string().optional()
})), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const user = c.get('user');

    const existingAkta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    if (!existingAkta) return c.json({ error: 'Akta not found' }, 404);

    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.aktaType, existingAkta.aktaType)
    });

    const stageInfo = template?.stages.find(s => s.id === data.stageId);
    const stageIndex = template?.stages.findIndex(s => s.id === data.stageId) || 0;
    const totalStages = template?.stages.length || 1;
    const progress = Math.round(((stageIndex + 1) / totalStages) * 100);

    await db.insert(progressHistory).values({
      id: crypto.randomUUID(),
      aktaId: id,
      stageId: data.stageId,
      stageName: stageInfo?.name || data.stageId,
      status: data.status,
      notes: data.notes,
      completedBy: user.id
    });

    await db.update(aktasTable)
      .set({
        currentStage: data.stageId,
        progress,
        status: data.status === 'completed' && stageIndex === totalStages - 1 ? 'completed' : existingAkta.status,
        updatedAt: new Date()
      })
      .where(eq(aktasTable.id, id));

    const akta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    return c.json({ message: 'Progress updated successfully', akta });
  } catch (error) {
    console.error('Update progress error:', error);
    return c.json({ error: 'Failed to update progress' }, 500);
  }
});

aktas.get('/:id/history', authenticate, async (c) => {
  try {
    const id = c.req.param('id');
    const history = await db.query.progressHistory.findMany({
      where: eq(progressHistory.aktaId, id),
      orderBy: [desc(progressHistory.createdAt)]
    });
    return c.json({ history });
  } catch (error) {
    console.error('Get history error:', error);
    return c.json({ error: 'Failed to get history' }, 500);
  }
});

aktas.post('/:id/generate', authenticate, async (c) => {
  try {
    const id = c.req.param('id');

    const akta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    if (!akta) return c.json({ error: 'Akta not found' }, 404);

    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.aktaType, akta.aktaType)
    });
    if (!template) return c.json({ error: 'Template not found' }, 404);

    const filePath = await generateDocument(akta, template);

    await db.update(aktasTable)
      .set({ documentPath: filePath, updatedAt: new Date() })
      .where(eq(aktasTable.id, id));

    return c.json({ message: 'Document generated successfully', documentPath: filePath });
  } catch (error) {
    console.error('Generate document error:', error);
    return c.json({ error: 'Failed to generate document' }, 500);
  }
});

aktas.get('/:id/document', authenticate, async (c) => {
  try {
    const id = c.req.param('id');

    const akta = await db.query.aktas.findFirst({ where: eq(aktasTable.id, id) });
    if (!akta) return c.json({ error: 'Akta not found' }, 404);
    if (!akta.documentPath) return c.json({ error: 'Document not generated yet' }, 404);

    const fullPath = join(process.cwd(), akta.documentPath);
    const fileStat = await stat(fullPath);
    const fileBuffer = await readFile(fullPath);

    c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    c.header('Content-Disposition', `attachment; filename="${akta.trackingCode}.docx"`);
    c.header('Content-Length', fileStat.size.toString());

    return c.body(fileBuffer);
  } catch (error) {
    console.error('Download document error:', error);
    return c.json({ error: 'Failed to download document' }, 500);
  }
});

export default aktas;
