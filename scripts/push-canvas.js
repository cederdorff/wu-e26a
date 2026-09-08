#!/usr/bin/env node
//
// Sender lokale ændringer i undervisning/*.md tilbage til Canvas (siden.body).
//
// Repoets indhold er styrende for de valgte sider i Canvas.
// Standard er dry-run af ikke-committede ændringer. --apply sender dem.
// --since=<commit> vælger ændrede filer fra et commit til HEAD (bruges i CI).
// En eksplicit filsti kan bruges til at sende en allerede committet side igen.
// Kun sidens body opdateres; nye sider oprettes ikke, og sider slettes ikke.

import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { marked } from "marked";
import {
  canvasRequest,
  loadLocalEnv,
  requiredEnv,
} from "./canvas-lib.js";

const projectRoot = resolve(import.meta.dirname, "..");
const teachingRoot = resolve(projectRoot, "undervisning");
const previewRoot = resolve(projectRoot, ".canvas-push-preview");

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const sinceArg = args.find((arg) => arg.startsWith("--since="));
const explicitPaths = args.filter((arg) => !arg.startsWith("--"));
for (const arg of args.filter((arg) => arg.startsWith("--"))) {
  if (arg !== "--apply" && !arg.startsWith("--since=")) throw new Error(`Ukendt argument: ${arg}`);
}
if (sinceArg && (!sinceArg.slice(8) || explicitPaths.length)) {
  throw new Error("Brug enten --since=<commit> eller eksplicitte filstier.");
}

await loadLocalEnv(resolve(projectRoot, ".env"));
const baseUrl = requiredEnv("CANVAS_BASE_URL").replace(/\/$/, "");
const courseId = requiredEnv("CANVAS_COURSE_ID");
const token = requiredEnv("CANVAS_ACCESS_TOKEN");
const apiRoot = `${baseUrl}/api/v1/courses/${encodeURIComponent(courseId)}`;
const repoBlobRoot = await githubBlobRoot();

const allTeachingFiles = await listMarkdownFiles(teachingRoot);
const pathToPage = await buildPathToPageMap(allTeachingFiles);

const targets = explicitPaths.length
  ? explicitPaths.map((path) => resolve(projectRoot, path))
  : changedTeachingFiles(sinceArg?.slice(8));

if (!targets.length) {
  console.log("Ingen lokalt ændrede undervisningsfiler fundet. Intet at pushe.");
  process.exit(0);
}

console.log(apply ? "Skriver til Canvas ..." : "Dry-run — intet skrives til Canvas. Kør med --apply for at gennemføre.");
console.log("");

let pushed = 0;
let skipped = 0;

for (const path of targets) {
  const relativePath = relative(projectRoot, path).replaceAll("\\", "/");
  console.log(`— ${relativePath}`);

  const raw = await readFile(path, "utf8").catch(() => null);
  if (raw === null) {
    console.log("  Springer over: filen findes ikke.");
    skipped += 1;
    continue;
  }

  const parsed = parseMirroredFile(raw);
  if (!parsed) {
    console.log("  Springer over: filen har ikke det forventede Canvas-metadata-format (ikke pullet fra Canvas).");
    skipped += 1;
    continue;
  }

  const { metadata, bodyMarkdown } = parsed;
  if (metadata.canvas_page_id === null || metadata.canvas_page_id === undefined) {
    console.log("  Springer over: intet Canvas-side tilknyttet (rent modul uden side).");
    skipped += 1;
    continue;
  }

  const livePage = await canvasRequest(`${apiRoot}/pages/page_id:${encodeURIComponent(metadata.canvas_page_id)}`, token);
  const { html, rewrites } = renderBodyHtml(bodyMarkdown, path, pathToPage, repoBlobRoot);
  const previewPath = resolve(previewRoot, `${relativePath.replace(/\.md$/, "")}.html`);
  await mkdir(dirname(previewPath), { recursive: true });
  await writeFile(previewPath, html, "utf8");

  console.log(`  Side: "${livePage.title}" (${baseUrl}/courses/${courseId}/pages/${livePage.url})`);
  if (rewrites.length) {
    console.log("  Links omskrevet:");
    for (const rewrite of rewrites) console.log(`    ${rewrite.from} -> ${rewrite.to}`);
  }
  console.log(`  HTML (${html.length} tegn) gemt til gennemsyn: ${relative(projectRoot, previewPath)}`);
  console.log(indent(previewHtml(html), "    "));

  if (!apply) {
    console.log("  (dry-run — ikke sendt. Åbn preview-filen og tjek den, før du kører med --apply.)");
    continue;
  }

  await canvasRequest(`${apiRoot}/pages/page_id:${encodeURIComponent(metadata.canvas_page_id)}`, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wiki_page: { body: html } }),
  });
  console.log("  Sendt til Canvas.");
  pushed += 1;
}

console.log("");
console.log(
  apply
    ? `Færdig: ${pushed} side(r) opdateret, ${skipped} sprunget over.`
    : `Dry-run færdig: ${targets.length - skipped} klar til push, ${skipped} sprunget over.`,
);

function parseMirroredFile(raw) {
  const metadataMatch = raw.match(/```yaml\n([\s\S]*?)\n```/);
  if (!metadataMatch) return null;

  const metadata = {};
  for (const line of metadataMatch[1].split("\n")) {
    const lineMatch = line.match(/^([a-z_]+):\s*(.+)$/);
    if (!lineMatch) continue;
    const [, key, rawValue] = lineMatch;
    metadata[key] = parseYamlValue(rawValue);
  }

  const separatorIndex = raw.indexOf("\n---\n\n<details>\n<summary>Canvas-metadata</summary>");
  if (separatorIndex === -1) return null;
  const titleAndBody = raw.slice(0, separatorIndex);
  const bodyMarkdown = titleAndBody.replace(/^#[^\n]*\n\n?/, "").trim();

  return { metadata, bodyMarkdown };
}

function parseYamlValue(rawValue) {
  if (rawValue === "null") return null;
  if (rawValue === "true") return true;
  if (rawValue === "false") return false;
  if (/^-?\d+$/.test(rawValue)) return Number(rawValue);
  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
}

function renderBodyHtml(bodyMarkdown, currentPath, pathToPage, repoBlobRoot) {
  const rewrites = [];
  const rewritten = bodyMarkdown.replace(/\]\(([^)\s]+)\)/g, (match, target) => {
    if (/^([a-z]+:)?\/\//i.test(target) || target.startsWith("#")) return match;
    const [linkPath, anchor = ""] = target.split("#");
    const absoluteTarget = resolve(dirname(currentPath), decodeURIComponent(linkPath));
    const page = pathToPage.get(absoluteTarget);
    const to = page
      ? `${baseUrl}/courses/${courseId}/pages/${page.canvas_page_slug}${anchor ? `#${anchor}` : ""}`
      : `${repoBlobRoot}/${relative(projectRoot, absoluteTarget).replaceAll("\\", "/")}${anchor ? `#${anchor}` : ""}`;
    rewrites.push({ from: target, to });
    return `](${to})`;
  });

  const html = marked.parse(rewritten, { gfm: true });
  return { html, rewrites };
}

async function buildPathToPageMap(files) {
  const map = new Map();
  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const parsed = parseMirroredFile(raw);
    if (!parsed || parsed.metadata.canvas_page_slug === null) continue;
    map.set(file, parsed.metadata);
  }
  return map;
}

function changedTeachingFiles(since) {
  const git = (args) => execFileSync("git", args, { cwd: projectRoot, encoding: "utf8" });
  // Et første push har en base bestående af nuller: sammenlign med et tomt træ.
  const base = since && /^0+$/.test(since)
    ? execFileSync("git", ["hash-object", "-t", "tree", "--stdin"], {
      cwd: projectRoot, input: "", encoding: "utf8",
    }).trim()
    : since ?? "HEAD";
  const names = git([
    "diff", "--name-only", "--diff-filter=AM", "--no-renames", "-z",
    base, ...(since ? ["HEAD"] : []), "--", "undervisning/",
  ]).split("\0");
  if (!since) names.push(...git(["ls-files", "--others", "--exclude-standard", "-z", "--", "undervisning/"]).split("\0"));
  return [...new Set(names)]
    .filter((name) => name.endsWith(".md"))
    .map((name) => resolve(projectRoot, name));
}

async function listMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(resolve(dir, entry.name))));
    } else if (entry.name.endsWith(".md")) {
      files.push(resolve(dir, entry.name));
    }
  }
  return files;
}

async function githubBlobRoot() {
  const packageJson = JSON.parse(await readFile(resolve(projectRoot, "package.json"), "utf8"));
  const repoUrl = (packageJson.repository?.url ?? "").replace(/^git\+/, "").replace(/\.git$/, "");
  return `${repoUrl}/blob/main`;
}

function previewHtml(html, maxLength = 600) {
  if (html.length <= maxLength) return html;
  return `${html.slice(0, maxLength)}\n... (${html.length - maxLength} tegn mere)`;
}

function indent(text, prefix) {
  return text
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}
