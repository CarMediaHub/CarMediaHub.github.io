import fs from "node:fs";
import path from "node:path";

const root = path.resolve("docs");
const files = fs.readdirSync(root).filter((file) => file.endsWith(".md"));
const stems = new Map();
for (const file of files) {
  const stem = file.replace(/_(?:zh|ko)(?=\.md$)/u, "").replace(/\.md$/u, "");
  const locale = file.endsWith("_zh.md") ? "zh" : file.endsWith("_ko.md") ? "ko" : "en";
  const locales = stems.get(stem) ?? new Set();
  locales.add(locale);
  stems.set(stem, locales);
}
const incomplete = [...stems.entries()].filter(([, locales]) => ["en", "zh", "ko"].some((locale) => !locales.has(locale)));
if (incomplete.length > 0) {
  throw new Error(`Documentation locale triplets are incomplete: ${incomplete.map(([stem, locales]) => `${stem} (${[...locales].sort().join(",")})`).join("; ")}`);
}
console.log(`Verified ${stems.size} documentation locale triplets.`);
