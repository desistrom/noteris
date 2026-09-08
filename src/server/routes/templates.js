import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { aktaTemplates, templateFields } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';
import { authenticate, requireRole } from '../middleware/auth.js';
import { writeFile, mkdir, unlink, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const templates = new Hono();

const ALLOWED_MIMES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
];
const ALLOWED_EXTS = ['.docx', '.pdf'];
const MAX_SIZE = 10 * 1024 * 1024;

async function saveUploadedFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') return null;
  const ext = extname(file.name || '').toLowerCase();
  const mime = file.type || '';
  if (!ALLOWED_EXTS.includes(ext) && !ALLOWED_MIMES.includes(mime)) {
    throw new Error('Only .docx and .pdf allowed');
  }
  if (file.size > MAX_SIZE) throw new Error('File too large, max 10MB');
  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = join(process.cwd(), 'uploads', 'templates');
  await mkdir(dir, { recursive: true });
  const fileName = `${crypto.randomUUID()}${ext}`;
  const filePath = join(dir, fileName);
  await writeFile(filePath, buffer);
  const relPath = `uploads/templates/${fileName}`;
  return { relPath, originalName: file.name, size: file.size, mime: mime || (ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') };
}

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

templates.get('/:id/preview', async (c) => {
  try {
    const id = c.req.param('id');
    const template = await db.query.aktaTemplates.findFirst({ where: eq(aktaTemplates.id, id) });
    if (!template || !template.templateFilePath) return c.json({ error: 'Preview not available' }, 404);
    const fullPath = join(process.cwd(), template.templateFilePath);
    if (!existsSync(fullPath)) return c.json({ error: 'File not found' }, 404);
    const buffer = await readFile(fullPath);
    const mime = template.templateMime || 'application/octet-stream';
    c.header('Content-Type', mime);
    c.header('Content-Disposition', `inline; filename="${template.templateFileName || 'template'}"`);
    return c.body(buffer);
  } catch (e) {
    console.error('Preview error:', e);
    return c.json({ error: 'Failed to preview' }, 500);
  }
});

templates.get('/:id/preview-html', async (c) => {
  try {
    const id = c.req.param('id');
    const template = await db.query.aktaTemplates.findFirst({ where: eq(aktaTemplates.id, id) });
    if (!template || !template.templateFilePath) return c.json({ error: 'Preview not available' }, 404);
    const fullPath = join(process.cwd(), template.templateFilePath);
    if (!existsSync(fullPath)) return c.json({ error: 'File not found' }, 404);
    if (template.templateMime?.includes('pdf') || template.templateFileName?.endsWith('.pdf')) {
      return c.json({ html: null, isPdf: true, message: 'PDF preview use iframe' });
    }
    const mammoth = await import('mammoth');
    const buffer = await readFile(fullPath);
    const result = await mammoth.convertToHtml({ buffer });
    return c.json({ html: result.value });
  } catch (e) {
    console.error('Preview html error:', e);
    return c.json({ error: 'Failed to convert preview' }, 500);
  }
});

templates.get('/:id/file', async (c) => {
  try {
    const id = c.req.param('id');
    const template = await db.query.aktaTemplates.findFirst({ where: eq(aktaTemplates.id, id) });
    if (!template || !template.templateFilePath) return c.json({ error: 'File not found' }, 404);
    const fullPath = join(process.cwd(), template.templateFilePath);
    if (!existsSync(fullPath)) return c.json({ error: 'File not found' }, 404);
    const buffer = await readFile(fullPath);
    const fileStat = await stat(fullPath);
    c.header('Content-Type', template.templateMime || 'application/octet-stream');
    c.header('Content-Disposition', `attachment; filename="${template.templateFileName || 'template'}"`);
    c.header('Content-Length', fileStat.size.toString());
    return c.body(buffer);
  } catch (e) {
    console.error('Download error:', e);
    return c.json({ error: 'Failed to download' }, 500);
  }
});

templates.post('/upload', authenticate, requireRole('super_admin'), async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body.file;
    if (!file) return c.json({ error: 'File .docx/.pdf required' }, 400);
    const name = body.name?.toString().trim();
    const aktaType = body.aktaType?.toString().trim();
    const category = body.category?.toString().trim();
    const description = body.description?.toString().trim() || null;
    const prefix = body.prefix?.toString().trim() || 'AKT';
    const stagesRaw = body.stages?.toString();
    const fieldsRaw = body.fields?.toString();
    if (!name || !aktaType || !category) return c.json({ error: 'name, aktaType, category required' }, 400);
    if (prefix.length < 1 || prefix.length > 20) return c.json({ error: 'Prefix 1-20 chars' }, 400);
    let stages = [];
    let fields = [];
    try { if (stagesRaw) stages = JSON.parse(stagesRaw); } catch {}
    try { if (fieldsRaw) fields = JSON.parse(fieldsRaw); } catch {}
    const saved = await saveUploadedFile(file);
    const templateId = crypto.randomUUID();
    await db.insert(aktaTemplates).values({
      id: templateId,
      name,
      aktaType,
      category,
      description,
      content: null,
      prefix,
      templateFilePath: saved.relPath,
      templateFileName: saved.originalName,
      templateFileSize: saved.size,
      templateMime: saved.mime,
      stages,
      version: 1
    });
    if (fields.length > 0) {
      const fieldValues = fields.map((field, index) => ({
        id: crypto.randomUUID(),
        templateId,
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required || false,
        options: field.options,
        placeholder: field.placeholder,
        validation: field.validation,
        order: index
      }));
      await db.insert(templateFields).values(fieldValues);
    }
    const template = await db.query.aktaTemplates.findFirst({ where: eq(aktaTemplates.id, templateId), with: { fields: true } });
    return c.json({ message: 'Template uploaded', template }, 201);
  } catch (error) {
    console.error('Upload template error:', error);
    return c.json({ error: error.message || 'Failed to upload template' }, 500);
  }
});

templates.put('/:id/upload', authenticate, requireRole('super_admin'), async (c) => {
  try {
    const id = c.req.param('id');
    const existing = await db.query.aktaTemplates.findFirst({ where: eq(aktaTemplates.id, id) });
    if (!existing) return c.json({ error: 'Template not found' }, 404);
    const body = await c.req.parseBody();
    const file = body.file;
    const name = body.name?.toString().trim();
    const category = body.category?.toString().trim();
    const description = body.description !== undefined ? body.description?.toString().trim() : undefined;
    const prefix = body.prefix?.toString().trim();
    const stagesRaw = body.stages?.toString();
    const fieldsRaw = body.fields?.toString();
    let stages;
    let fields;
    try { if (stagesRaw) stages = JSON.parse(stagesRaw); } catch {}
    try { if (fieldsRaw) fields = JSON.parse(fieldsRaw); } catch {}
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description || null;
    if (prefix !== undefined) {
      if (prefix.length < 1 || prefix.length > 20) return c.json({ error: 'Prefix 1-20 chars' }, 400);
      updateData.prefix = prefix;
    }
    if (stages !== undefined) updateData.stages = stages;
    updateData.version = existing.version + 1;
    updateData.updatedAt = new Date();
    if (file && typeof file.arrayBuffer === 'function' && file.size > 0) {
      const saved = await saveUploadedFile(file);
      if (existing.templateFilePath && existsSync(join(process.cwd(), existing.templateFilePath))) {
        try { await unlink(join(process.cwd(), existing.templateFilePath)); } catch {}
      }
      updateData.templateFilePath = saved.relPath;
      updateData.templateFileName = saved.originalName;
      updateData.templateFileSize = saved.size;
      updateData.templateMime = saved.mime;
      updateData.content = null;
    }
    await db.update(aktaTemplates).set(updateData).where(eq(aktaTemplates.id, id));
    if (fields !== undefined) {
      await db.delete(templateFields).where(eq(templateFields.templateId, id));
      if (fields.length > 0) {
        const fieldValues = fields.map((field, index) => ({
          id: field.id || crypto.randomUUID(),
          templateId: id,
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required || false,
          options: field.options,
          placeholder: field.placeholder,
          validation: field.validation,
          order: index
        }));
        await db.insert(templateFields).values(fieldValues);
      }
    }
    const template = await db.query.aktaTemplates.findFirst({ where: eq(aktaTemplates.id, id), with: { fields: true } });
    return c.json({ message: 'Template updated', template });
  } catch (error) {
    console.error('Update upload error:', error);
    return c.json({ error: error.message || 'Failed to update' }, 500);
  }
});

templates.post('/', authenticate, requireRole('super_admin'), zValidator('json', z.object({
  name: z.string().min(2),
  aktaType: z.string().min(2),
  category: z.string().min(2),
  description: z.string().optional(),
  content: z.string().optional().nullable(),
  prefix: z.string().min(1).max(20).optional().default('AKT'),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    order: z.number()
  })).optional().default([]),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'textarea', 'number', 'date', 'select', 'multiselect', 'checkbox']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
    validation: z.string().optional()
  })).optional().default([])
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
      content: data.content || null,
      prefix: data.prefix || 'AKT',
      stages: data.stages || [],
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
  content: z.string().optional().nullable(),
  prefix: z.string().min(1).max(20).optional(),
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
    const setData = { ...data, version: existingTemplate.version + 1, updatedAt: new Date() };
    await db.update(aktaTemplates).set(setData).where(eq(aktaTemplates.id, id));
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
    if (existingTemplate.templateFilePath && existsSync(join(process.cwd(), existingTemplate.templateFilePath))) {
      try { await unlink(join(process.cwd(), existingTemplate.templateFilePath)); } catch {}
    }
    await db.delete(templateFields).where(eq(templateFields.templateId, id));
    await db.delete(aktaTemplates).where(eq(aktaTemplates.id, id));
    return c.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    return c.json({ error: 'Failed to delete template' }, 500);
  }
});

export default templates;
