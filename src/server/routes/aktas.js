import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { aktas, progressHistory, aktaTemplates } from '../../lib/schema.js';
import { eq, desc, and } from 'drizzle-orm';

const aktas = new Hono();

// Get all aktas with pagination and filters
aktas.get('/', async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = parseInt(c.req.query('limit')) || 10;
    const status = c.req.query('status');
    const aktaType = c.req.query('aktaType');
    const clientId = c.req.query('clientId');

    const whereConditions = [];
    
    if (status) {
      whereConditions.push(eq(aktas.status, status));
    }
    
    if (aktaType) {
      whereConditions.push(eq(aktas.aktaType, aktaType));
    }
    
    if (clientId) {
      whereConditions.push(eq(aktas.clientId, clientId));
    }

    const offset = (page - 1) * limit;

    const allAktas = await db.query.aktas.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(aktas.createdAt)],
      limit: limit,
      offset: offset
    });

    const total = await db.$count(aktas, whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return c.json({
      aktas: allAktas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get aktas error:', error);
    return c.json({ error: 'Failed to get aktas' }, 500);
  }
});

// Get akta by ID
aktas.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const akta = await db.query.aktas.findFirst({
      where: eq(aktas.id, id),
      with: {
        progressHistory: {
          orderBy: [desc(progressHistory.createdAt)]
        }
      }
    });

    if (!akta) {
      return c.json({ error: 'Akta not found' }, 404);
    }

    return c.json({ akta });
  } catch (error) {
    console.error('Get akta error:', error);
    return c.json({ error: 'Failed to get akta' }, 500);
  }
});

// Create new akta
aktas.post('/', zValidator('json', z.object({
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

    // Get template to get stages
    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.aktaType, data.aktaType)
    });

    if (!template) {
      return c.json({ error: 'Template not found for this akta type' }, 404);
    }

    const aktaId = crypto.randomUUID();
    const firstStage = template.stages[0]?.id || 'draft';

    // Insert akta
    await db.insert(aktas).values({
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
      progress: 0
    });

    // Insert initial progress history
    await db.insert(progressHistory).values({
      id: crypto.randomUUID(),
      aktaId: aktaId,
      stageId: firstStage,
      stageName: template.stages[0]?.name || 'Draft',
      status: 'started',
      notes: 'Akta created'
    });

    const akta = await db.query.aktas.findFirst({
      where: eq(aktas.id, aktaId)
    });

    return c.json({ message: 'Akta created successfully', akta }, 201);
  } catch (error) {
    console.error('Create akta error:', error);
    return c.json({ error: 'Failed to create akta' }, 500);
  }
});

// Update akta
aktas.put('/:id', zValidator('json', z.object({
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

    const existingAkta = await db.query.aktas.findFirst({
      where: eq(aktas.id, id)
    });

    if (!existingAkta) {
      return c.json({ error: 'Akta not found' }, 404);
    }

    // Update akta
    await db.update(aktas)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(aktas.id, id));

    // If stage changed, add progress history
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

    const akta = await db.query.aktas.findFirst({
      where: eq(aktas.id, id)
    });

    return c.json({ message: 'Akta updated successfully', akta });
  } catch (error) {
    console.error('Update akta error:', error);
    return c.json({ error: 'Failed to update akta' }, 500);
  }
});

// Delete akta
aktas.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const existingAkta = await db.query.aktas.findFirst({
      where: eq(aktas.id, id)
    });

    if (!existingAkta) {
      return c.json({ error: 'Akta not found' }, 404);
    }

    // Delete progress history first
    await db.delete(progressHistory).where(eq(progressHistory.aktaId, id));
    
    // Delete akta
    await db.delete(aktas).where(eq(aktas.id, id));

    return c.json({ message: 'Akta deleted successfully' });
  } catch (error) {
    console.error('Delete akta error:', error);
    return c.json({ error: 'Failed to delete akta' }, 500);
  }
});

// Update progress (move to next stage)
aktas.post('/:id/progress', zValidator('json', z.object({
  stageId: z.string(),
  status: z.enum(['started', 'in_progress', 'completed', 'on_hold']),
  notes: z.string().optional(),
  completedBy: z.string()
})), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');

    const existingAkta = await db.query.aktas.findFirst({
      where: eq(aktas.id, id)
    });

    if (!existingAkta) {
      return c.json({ error: 'Akta not found' }, 404);
    }

    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.aktaType, existingAkta.aktaType)
    });

    const stageInfo = template?.stages.find(s => s.id === data.stageId);
    const stageIndex = template?.stages.findIndex(s => s.id === data.stageId) || 0;
    const totalStages = template?.stages.length || 1;
    const progress = Math.round(((stageIndex + 1) / totalStages) * 100);

    // Add progress history
    await db.insert(progressHistory).values({
      id: crypto.randomUUID(),
      aktaId: id,
      stageId: data.stageId,
      stageName: stageInfo?.name || data.stageId,
      status: data.status,
      notes: data.notes,
      completedBy: data.completedBy
    });

    // Update akta progress
    await db.update(aktas)
      .set({
        currentStage: data.stageId,
        progress: progress,
        status: data.status === 'completed' && stageIndex === totalStages - 1 ? 'completed' : existingAkta.status,
        updatedAt: new Date()
      })
      .where(eq(aktas.id, id));

    const akta = await db.query.aktas.findFirst({
      where: eq(aktas.id, id)
    });

    return c.json({ message: 'Progress updated successfully', akta });
  } catch (error) {
    console.error('Update progress error:', error);
    return c.json({ error: 'Failed to update progress' }, 500);
  }
});

// Get progress history
aktas.get('/:id/history', async (c) => {
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

export default aktas;
