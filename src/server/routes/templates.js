import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { aktaTemplates, templateFields } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';
import { authenticate, requireRole } from '../middleware/auth.js';

const templates = new Hono();

templates.get('/', async (c) => {
  try {
    const allTemplates = await db.query.aktaTemplates.findMany({
      with: { fields: true },
      orderBy: (t, { asc }) => [asc(t.name)]
    });
    return c.json({ templates: allTemplates });
  } catch (error) {
    console.error('Get templates error:', error);
    return c.json({ error: 'Failed to get templates' }, 500);
  }
});

templates.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.id, id),
      with: { fields: true }
    });
    if (!template) return c.json({ error: 'Template not found' }, 404);
    return c.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    return c.json({ error: 'Failed to get template' }, 500);
  }
});

templates.get('/type/:aktaType', async (c) => {
  try {
    const aktaType = c.req.param('aktaType');
    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.aktaType, aktaType),
      with: { fields: true }
    });
    if (!template) return c.json({ error: 'Template not found' }, 404);
    return c.json({ template });
  } catch (error) {
    console.error('Get template by type error:', error);
    return c.json({ error: 'Failed to get template' }, 500);
  }
});

templates.post('/', authenticate, requireRole('super_admin'), zValidator('json', z.object({
  name: z.string().min(2),
  aktaType: z.string().min(2),
  category: z.string().min(2),
  description: z.string().optional(),
  content: z.string(),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    order: z.number()
  })),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
    validation: z.string().optional()
  }))
})), async (c) => {
  try {
    const data = c.req.valid('json');
    const templateId = crypto.randomUUID();

    await db.insert(aktaTemplates).values({
      id: templateId,
      name: data.name,
      aktaType: data.aktaType,
      category: data.category,
      description: data.description,
      content: data.content,
      stages: data.stages,
      version: 1
    });

    if (data.fields && data.fields.length > 0) {
      const fieldValues = data.fields.map((field, index) => ({
        id: crypto.randomUUID(),
        templateId: templateId,
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
        placeholder: field.placeholder,
        validation: field.validation,
        order: index
      }));
      await db.insert(templateFields).values(fieldValues);
    }

    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.id, templateId),
      with: { fields: true }
    });

    return c.json({ message: 'Template created successfully', template }, 201);
  } catch (error) {
    console.error('Create template error:', error);
    return c.json({ error: 'Failed to create template' }, 500);
  }
});

templates.put('/:id', authenticate, requireRole('super_admin'), zValidator('json', z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    order: z.number()
  })).optional(),
  fields: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
    validation: z.string().optional()
  })).optional()
})), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');

    const existingTemplate = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.id, id)
    });
    if (!existingTemplate) return c.json({ error: 'Template not found' }, 404);

    await db.update(aktaTemplates)
      .set({ ...data, version: existingTemplate.version + 1, updatedAt: new Date() })
      .where(eq(aktaTemplates.id, id));

    if (data.fields) {
      await db.delete(templateFields).where(eq(templateFields.templateId, id));
      const fieldValues = data.fields.map((field, index) => ({
        id: field.id || crypto.randomUUID(),
        templateId: id,
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
        placeholder: field.placeholder,
        validation: field.validation,
        order: index
      }));
      await db.insert(templateFields).values(fieldValues);
    }

    const template = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.id, id),
      with: { fields: true }
    });

    return c.json({ message: 'Template updated successfully', template });
  } catch (error) {
    console.error('Update template error:', error);
    return c.json({ error: 'Failed to update template' }, 500);
  }
});

templates.delete('/:id', authenticate, requireRole('super_admin'), async (c) => {
  try {
    const id = c.req.param('id');
    const existingTemplate = await db.query.aktaTemplates.findFirst({
      where: eq(aktaTemplates.id, id)
    });
    if (!existingTemplate) return c.json({ error: 'Template not found' }, 404);

    await db.delete(templateFields).where(eq(templateFields.templateId, id));
    await db.delete(aktaTemplates).where(eq(aktaTemplates.id, id));

    return c.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    return c.json({ error: 'Failed to delete template' }, 500);
  }
});

export default templates;
