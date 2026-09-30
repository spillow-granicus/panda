import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { WorkingDesign } from "./design";
import { isIncluded, sectionDefinition } from "./sections";

function pdfSafe(text: string): string {
  return text
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("‘", "'")
    .replaceAll("’", "'")
    .replaceAll("—", "-")
    .replaceAll("–", "-")
    .replaceAll("…", "...")
    .replace(/[^\x09\x0a\x0d\x20-\xff]/g, "");
}

function wrapLine(text: string, maxChars: number): string[] {
  const words = pdfSafe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const pieces = word.length > maxChars ? word.match(new RegExp(`.{1,${maxChars}}`, "g")) ?? [word] : [word];
    for (const piece of pieces) {
      const next = current ? `${current} ${piece}` : piece;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = piece;
      } else {
        current = next;
      }
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

export async function renderDesignPdf(design: WorkingDesign): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const included = design.sections.filter((section) => isIncluded(section.status));

  let page = pdf.addPage([612, 792]);
  let y = 740;
  const left = 56;
  const ink = rgb(0.11, 0.1, 0.08);

  const drawLine = (text: string, size: number, face: typeof font) => {
    if (y < 72) {
      page = pdf.addPage([612, 792]);
      y = 740;
    }
    page.drawText(text, { x: left, y, size, font: face, color: ink });
    y -= size + 6;
  };

  drawLine(pdfSafe(design.accountName), 18, bold);
  drawLine(pdfSafe(design.opportunityName), 12, font);
  y -= 8;

  if (included.length === 0) {
    drawLine("No sections are ready to share yet.", 12, font);
    return pdf.save();
  }

  for (const section of included) {
    const definition = sectionDefinition(section.id);
    y -= 8;
    drawLine(definition.label, 14, bold);
    const paragraphs = section.content.split(/\n+/);
    for (const paragraph of paragraphs) {
      const lines = wrapLine(paragraph, 85);
      for (const line of lines) {
        drawLine(line, 11, font);
      }
      y -= 4;
    }
  }

  return pdf.save();
}
