import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const root = process.cwd();
const contentDir = path.join(root, "content");
const templatePath = path.join(root, "template.html");
const outputDir = path.join(root, "dist");
const outputPath = path.join(outputDir, "index.html");

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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
  .map((file, index) => {
    const relativePath = path.relative(contentDir, file).split(path.sep).join("/");
    const markdown = fs.readFileSync(file, "utf8").trim();
    const rendered = marked.parse(markdown, {\n      gfm: true,\n      breaks: false\n    });
    const safeMarkdown = escapeHtml(markdown);
    const postId = `post-${index + 1}`;

    return [
      `<article class="post-item" id="${postId}" data-source="${relativePath}" data-post-index="${index + 1}">`,
      '  <div class="post-toolbar" role="toolbar" aria-label="Ovládání článku">',
      '    <div class="post-source">',
      `      <span class="post-number">#${String(index + 1).padStart(2, "0")}</span>`,
      '      <span class="post-source-dot" aria-hidden="true"></span>',
      `      <span class="post-source-name">${escapeHtml(relativePath)}</span>`,
      "    </div>",
      '    <div class="post-actions">',
      '      <button type="button" class="post-action is-active" data-post-mode="preview">Preview</button>',
      '      <button type="button" class="post-action" data-post-mode="markdown">Markdown</button>',
      '      <button type="button" class="post-action post-copy" data-copy-markdown aria-label="Kopírovat Markdown">',
      '        <span class="post-copy-label">Copy</span>',
      "      </button>",
      "    </div>",
      "  </div>",
      `  <div class="post-preview" data-post-preview>${rendered.trim()}</div>`,
      `  <pre class="post-markdown" data-post-markdown hidden><code>${safeMarkdown}</code></pre>`,
      "</article>"
    ].join("\n");
  })
  .join("\n");

const finalHtml = template
  .replace("{{content}}", htmlContent)
  .replace("{{postCount}}", String(markdownFiles.length).padStart(2, "0"));

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, finalHtml, "utf8");

if (fs.existsSync(path.join(root, "BetterText.css"))) {
  fs.copyFileSync(path.join(root, "BetterText.css"), path.join(outputDir, "BetterText.css"));
}

console.log("Build hotov.");
console.log(`Markdown files: ${markdownFiles.length}`);

for (const file of markdownFiles) {
  console.log(` - ${path.relative(contentDir, file)}`);
}

console.log(`HTML: ${outputPath}`);
