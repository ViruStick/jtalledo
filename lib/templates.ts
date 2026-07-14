import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

const TEMPLATES_ROOT = path.join(process.cwd(), "templates");

export interface TemplateInfo {
  id: string;
  name: string;
  path: string;
  markers: string[];
}

function extractMarkers(filePath: string): string[] {
  const content = fs.readFileSync(filePath);
  const zip = new PizZip(content);
  const markers = new Set<string>();
  const tagRegex = /\{([^}]+)\}/g;

  const xmlFiles = zip.file(/word\/(document|header\d*|footer\d*)\.xml/);
  xmlFiles.forEach((file) => {
    const raw = file.asText();
    const stripped = raw.replace(/<[^>]+>/g, "");
    let match;
    while ((match = tagRegex.exec(stripped)) !== null) {
      markers.add(match[1].trim());
    }
  });

  return Array.from(markers);
}

export function scanTemplates(subdir?: string): TemplateInfo[] {
  const root = subdir ? path.join(TEMPLATES_ROOT, subdir) : TEMPLATES_ROOT;

  if (!fs.existsSync(root)) return [];

  const results: TemplateInfo[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".docx")) {
        const relativePath = path.relative(TEMPLATES_ROOT, fullPath);
        const markers = extractMarkers(fullPath);
        results.push({
          id: relativePath.replace(/\\/g, "/").replace(/\.docx$/, ""),
          name: entry.name.replace(/\.docx$/, ""),
          path: relativePath.replace(/\\/g, "/"),
          markers,
        });
      }
    }
  }

  walk(root);
  return results;
}

export function generateDocument(
  templatePath: string,
  data: Record<string, string>,
): Buffer {
  const fullPath = path.join(TEMPLATES_ROOT, templatePath);
  const content = fs.readFileSync(fullPath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.render(data);
  return doc.getZip().generate({ type: "nodebuffer" }) as Buffer;
}
