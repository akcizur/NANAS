import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const root = process.cwd();
const contentDir = path.join(root, "content");
const templatePath = path.join(root, "template.html");
const outputDir = path.join(root, "dist");
const outputPath = path.join(outputDir, "index.html");
const cssPath = path.join(root, "BetterText.css");
const cssOutputPath = path.join(outputDir, "BetterText.css");

if (!fs.existsSync(contentDir)) {
  throw new Error(`Missing content directory: ${contentDir}`);
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing HTML template: ${templatePath}`);
}

function findMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) =>
    path.relative(contentDir, a).localeCompare(
      path.relative(contentDir, b),
      "cs",
      { numeric: true, sensitivity: "base" }
    )
  );
}

const markdownFiles = findMarkdownFiles(contentDir);

if (markdownFiles.length === 0) {
  throw new Error("No Markdown files found in content/.");
}

const template = fs.readFileSync(templatePath, "utf8");

if (!template.includes("{{content}}")) {
  throw new Error("Template must contain the {{content}} placeholder.");
}

const htmlContent = markdownFiles
  .map((file) => fs.readFileSync(file, "utf8"))
  .map((markdown) => marked.parse(markdown))
  .join("\n");

const finalHtml = template.replace("{{content}}", htmlContent);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, finalHtml, "utf8");

if (fs.existsSync(cssPath)) {
  fs.copyFileSync(cssPath, cssOutputPath);
}

console.log("Build hotov.");
console.log(`Markdown files: ${markdownFiles.length}`);

for (const file of markdownFiles) {
  console.log(` - ${path.relative(contentDir, file)}`);
}

console.log(`HTML: ${outputPath}`);
