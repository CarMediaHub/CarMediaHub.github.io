import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");
const files = [
  ...fs.readdirSync(root).filter((file) => /^readme(?:_zh|_ko)?\.md$/u.test(file)).map((file) => path.join(root, file)),
  ...fs.readdirSync(path.join(root, "docs")).filter((file) => file.endsWith(".md")).map((file) => path.join(root, "docs", file))
];
const prohibited = [
  /\b(?:legacy|deprecated|former|old)\s+site[_-]?gateway\b/iu,
  /旧\s*site[_-]?gateway/iu,
  /已废止条目/iu,
  /\b(?:기존|폐기된)\s*site[_-]?gateway\b/iu,
  /폐기된 항목/iu
];
const violations = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of prohibited) if (pattern.test(text)) violations.push(`${path.relative(root, file)}: ${pattern}`);
}
if (violations.length > 0) throw new Error(`Public documentation contains prohibited project-history wording:\n${violations.join("\n")}`);
console.log(`Verified public wording boundaries in ${files.length} Markdown files.`);
