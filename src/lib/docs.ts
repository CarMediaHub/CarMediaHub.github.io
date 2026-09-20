import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type Locale = "en" | "zh" | "ko";
export interface DocPage { slug: string; locale: Locale; title: string; description: string; html: string; source: string; }

const localeFor = (filename: string): Locale => filename.endsWith("_zh.md") ? "zh" : filename.endsWith("_ko.md") ? "ko" : "en";
const stemFor = (filename: string): string => filename.replace(/_(zh|ko)(?=\.md$)/, "").replace(/\.md$/, "");

export function getDocs(): DocPage[] {
  const root = path.resolve(process.cwd(), "docs");
  return fs.readdirSync(root).filter((filename: string) => filename.endsWith(".md")).map((filename: string) => {
    const raw = fs.readFileSync(path.join(root, filename), "utf8");
    const firstHeading = raw.match(/^#\s+(.+)$/m)?.[1] ?? stemFor(filename);
    const firstParagraph = raw.split(/\r?\n\r?\n/).find((part: string) => part && !part.startsWith("#") && !part.startsWith("```"))?.replace(/[`*_]/g, "").trim() ?? "CarMediaHub documentation";
    return { slug: stemFor(filename), locale: localeFor(filename), title: firstHeading, description: firstParagraph.slice(0, 180), html: marked.parse(raw) as string, source: filename };
  });
}

export function displayPath(page: DocPage): string { return `/docs/${page.locale}/${page.slug}/`; }
