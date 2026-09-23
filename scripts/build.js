import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const root = process.cwd();
const sourcePath = path.join(root, "content", "index.md");
const templatePath = path.join(root, "template.html");
const outputDir = path.join(root, "dist");
const outputPath = path.join(outputDir, "index.html");
const cssPath = path.join(root, "BetterText.css");
const cssOutputPath = path.join(outputDir, "BetterText.css");

if (!fs.existsSync(sourcePath)) {
  throw new Error(`Missing Markdown source: ${sourcePath}`);
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`Missing HTML template: ${templatePath}`);
}

const markdown = fs.readFileSync(sourcePath, "utf8");
const template = fs.readFileSync(templatePath, "utf8");
const htmlContent = marked.parse(markdown);

if (!template.includes("{{content}}")) {
  throw new Error("Template must contain the {{content}} placeholder.");
}

const finalHtml = template.replace("{{content}}", htmlContent);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, finalHtml, "utf8");

if (fs.existsSync(cssPath)) {
  fs.copyFileSync(cssPath, cssOutputPath);
}

console.log("Build hotov.");
console.log(`Markdown: ${sourcePath}`);
console.log(`HTML:     ${outputPath}`);
