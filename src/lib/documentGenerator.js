import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getDeedContent } from './deedContent.js';

export function replacePlaceholders(text, data) {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
}

function createParagraphsFromText(text, data) {
  const lines = replacePlaceholders(text, data).split('\n');
  const paragraphs = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    const isPasalHeading = /^PASAL\s+\d+/i.test(trimmed);
    const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 3;

    if (isPasalHeading) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: trimmed, bold: true, size: 24 })]
      }));
    } else if (isAllCaps) {
      paragraphs.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: trimmed, bold: true, size: 24 })]
      }));
    } else {
      paragraphs.push(new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: trimmed, size: 22 })]
      }));
    }
  }

  return paragraphs;
}

export async function generateDocument(akta, template) {
  const formData = akta.formData || {};
  if (template.templateFilePath && existsSync(join(process.cwd(), template.templateFilePath))) {
    const ext = template.templateFileName?.toLowerCase().endsWith('.pdf') || template.templateMime?.includes('pdf') ? 'pdf' : 'docx';
    if (ext === 'docx') {
      try {
        const PizZip = (await import('pizzip')).default;
        const Docxtemplater = (await import('docxtemplater')).default;
        const buf = await readFile(join(process.cwd(), template.templateFilePath));
        const zip = new PizZip(buf);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: '{{', end: '}}' } });
        const data = { ...formData, trackingCode: akta.trackingCode, nomor: akta.trackingCode, aktaType: akta.aktaType, clientName: akta.clientName };
        doc.render(data);
        const out = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
        await mkdir(join(process.cwd(), 'generated'), { recursive: true });
        const filePath = `generated/${akta.id}.docx`;
        await writeFile(join(process.cwd(), filePath), out);
        return filePath;
      } catch (e) {
        console.warn('Docxtemplater failed, fallback to default generator', e.message);
      }
    } else {
      try {
        const { PDFDocument } = await import('pdf-lib');
        const buf = await readFile(join(process.cwd(), template.templateFilePath));
        const pdfDoc = await PDFDocument.load(buf);
        const pages = pdfDoc.getPages();
        if (pages.length > 0) {
          const first = pages[0];
          first.drawText(`No: ${akta.trackingCode}`, { x: 50, y: first.getHeight() - 30, size: 9 });
        }
        const out = await pdfDoc.save();
        await mkdir(join(process.cwd(), 'generated'), { recursive: true });
        const filePath = `generated/${akta.id}.pdf`;
        await writeFile(join(process.cwd(), filePath), out);
        return filePath;
      } catch (e) {
        console.warn('PDF templating failed', e.message);
      }
    }
  }

  const deedData = getDeedContent(akta.aktaType);
  if (!deedData) {
    throw new Error(`No document content defined for akta type: ${akta.aktaType}`);
  }

  const allParagraphs = [];

  allParagraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: 'AKTA NOTARIS', bold: true, size: 32 })]
  }));

  allParagraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text: template.name, bold: true, size: 26 })]
  }));

  allParagraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: `Nomor: ${akta.trackingCode}`, bold: true, size: 22 })]
  }));

  allParagraphs.push(new Paragraph({ children: [] }));

  if (deedData.preamble) {
    allParagraphs.push(...createParagraphsFromText(deedData.preamble, formData));
    allParagraphs.push(new Paragraph({ children: [] }));
  }

  if (deedData.body) {
    allParagraphs.push(...createParagraphsFromText(deedData.body, formData));
  }

  allParagraphs.push(new Paragraph({ children: [] }));
  allParagraphs.push(new Paragraph({ children: [] }));

  allParagraphs.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 400, after: 100 },
    children: [new TextRun({ text: `Dibuat di ${formData.signingCity || '__________'}`, size: 22 })]
  }));
  allParagraphs.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    children: [new TextRun({ text: `Pada tanggal ${formData.signingDate || '__________'}`, size: 22 })]
  }));

  allParagraphs.push(new Paragraph({ children: [] }));
  allParagraphs.push(new Paragraph({ children: [] }));

  allParagraphs.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({ text: 'Mengetahui dan Menandatangani:', size: 22 }),
    ]
  }));

  allParagraphs.push(new Paragraph({ children: [] }));
  allParagraphs.push(new Paragraph({ children: [] }));

  const signBlock = [
    { title: 'Notaris', left: true },
    { title: 'Para Pihak', left: false },
  ];

  for (const block of signBlock) {
    allParagraphs.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: `(${block.title})`, size: 22 })]
    }));
    allParagraphs.push(new Paragraph({ children: [] }));
    allParagraphs.push(new Paragraph({ children: [] }));
    allParagraphs.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: '________________________', size: 22 })]
    }));
    allParagraphs.push(new Paragraph({ children: [] }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: allParagraphs
    }]
  });

  const buffer = await Packer.toBuffer(doc);

  await mkdir(join(process.cwd(), 'generated'), { recursive: true });
  const filePath = `generated/${akta.id}.docx`;
  const fullPath = join(process.cwd(), filePath);
  await writeFile(fullPath, buffer);

  return filePath;
}
