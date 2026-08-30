#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const projectRoot = resolve(import.meta.dirname, "..");
const force = process.argv.includes("--force");
await loadLocalEnv(resolve(projectRoot, ".env"));

const baseUrl = requiredEnv("CANVAS_BASE_URL").replace(/\/$/, "");
const courseId = requiredEnv("CANVAS_COURSE_ID");
const token = requiredEnv("CANVAS_ACCESS_TOKEN");
const apiRoot = `${baseUrl}/api/v1/courses/${encodeURIComponent(courseId)}`;
const teachingRoot = resolve(projectRoot, "undervisning");
const filesRoot = resolve(projectRoot, "materialer/canvas-filer");
const dataRoot = resolve(projectRoot, "canvas/data");
const manifestPath = resolve(projectRoot, "canvas/mirror-manifest.json");
const incomingRoot = resolve(projectRoot, ".canvas-incoming");

const previousManifest = await readJsonIfPresent(manifestPath) ?? { files: {} };

const course = await canvasRequest(apiRoot);
const [modules, pageSummaries, assignments, discussions, quizzes, files, folders] = await Promise.all([
  canvasList(`${apiRoot}/modules?include[]=items&include[]=content_details&per_page=100`),
  canvasList(`${apiRoot}/pages?per_page=100`),
  canvasList(`${apiRoot}/assignments?per_page=100`),
  canvasList(`${apiRoot}/discussion_topics?per_page=100`),
  canvasList(`${apiRoot}/quizzes?per_page=100`),
  canvasList(`${apiRoot}/files?per_page=100`),
  canvasList(`${apiRoot}/folders?per_page=100`),
]);

for (const module of modules) {
  if (!Array.isArray(module.items)) {
    module.items = await canvasList(`${apiRoot}/modules/${encodeURIComponent(module.id)}/items?include[]=content_details&per_page=100`);
  }
  module.items.sort(byPosition);
}
modules.sort(byPosition);

const pages = await mapLimit(pageSummaries, 8, (page) =>
  canvasRequest(`${apiRoot}/pages/page_id:${encodeURIComponent(page.page_id)}`),
);
const pageByUrl = new Map(pages.map((page) => [page.url, page]));
const modulePageUrls = new Set();

const folderById = new Map(folders.map((folder) => [folder.id, folder]));
const fileRecords = await downloadFiles(files, folderById);
const localFileById = new Map(fileRecords.map((file) => [file.id, file.local_path]));

const documents = [];
const pageDocumentByUrl = new Map();

for (let index = 0; index < modules.length; index += 1) {
  const module = modules[index];
  const pageItem = module.items.find((item) => item.type === "Page" && item.page_url);
  const page = pageItem ? pageByUrl.get(pageItem.page_url) : null;
  if (pageItem?.page_url) modulePageUrls.add(pageItem.page_url);
  const filename = `${pad(index + 1)}-${slug(module.name)}.md`;
  const document = {
    kind: "module",
    module,
    page,
    pageItem,
    path: resolve(teachingRoot, filename),
  };
  documents.push(document);
  if (page) pageDocumentByUrl.set(page.url, document);
}

const orphanPages = pages
  .filter((page) => !modulePageUrls.has(page.url))
  .sort((a, b) => a.title.localeCompare(b.title, "da"));

for (let index = 0; index < orphanPages.length; index += 1) {
  const page = orphanPages[index];
  const number = modules.length + index + 1;
  const document = {
    kind: "orphan-page",
    module: null,
    page,
    pageItem: null,
    path: resolve(teachingRoot, `${pad(number)}-${slug(page.title)}.md`),
  };
  documents.push(document);
  pageDocumentByUrl.set(page.url, document);
}

const currentManifest = {
  course_id: Number(courseId),
  pulled_at: new Date().toISOString(),
  files: {},
};
const conflicts = [];
let created = 0;
let updated = 0;
let unchanged = 0;

await mkdir(teachingRoot, { recursive: true });
for (const document of documents) {
  const markdown = renderDocument(document, pageDocumentByUrl, localFileById);
  const result = await writeMirroredFile(document.path, markdown);
  if (result === "created") created += 1;
  if (result === "updated") updated += 1;
  if (result === "unchanged") unchanged += 1;
}

await mkdir(dataRoot, { recursive: true });
await writeGeneratedJson(resolve(dataRoot, "course.json"), selectCourse(course));
await writeGeneratedJson(resolve(dataRoot, "modules.json"), modules);
await writeGeneratedJson(resolve(dataRoot, "pages.json"), pages);
await writeGeneratedJson(resolve(dataRoot, "assignments.json"), assignments);
await writeGeneratedJson(resolve(dataRoot, "discussions.json"), discussions);
await writeGeneratedJson(resolve(dataRoot, "quizzes.json"), quizzes);
await writeGeneratedJson(resolve(dataRoot, "files.json"), fileRecords);
await writeGeneratedJson(resolve(dataRoot, "folders.json"), folders);
await writeGeneratedFile(
  resolve(projectRoot, "canvas/moduler.md"),
  renderModuleIndex(course, modules, documents, pageDocumentByUrl, localFileById),
);
await updateReadmeOverview(course, modules, documents);

await removeObsoleteMirrorFiles(previousManifest, currentManifest);
await writeGeneratedJson(manifestPath, currentManifest);

console.log(`Canvas-spejl: ${documents.length} Markdown-filer (${created} oprettet, ${updated} opdateret, ${unchanged} uændret).`);
console.log(`Moduler: ${modules.length}; sider: ${pages.length} (${pages.filter((page) => !page.published).length} upublicerede).`);
console.log(`Filer: ${fileRecords.length}; assignments: ${assignments.length}; discussions: ${discussions.length}; quizzes: ${quizzes.length}.`);
if (conflicts.length) {
  console.log(`Lokale ændringer bevaret i ${conflicts.length} fil(er). Nye Canvas-versioner ligger i .canvas-incoming/.`);
  for (const path of conflicts) console.log(`Konflikt: ${path}`);
}

function renderDocument(document, pageDocumentByUrl, localFileById) {
  const { module, page, pageItem } = document;
  const title = module?.name ?? page.title;
  const metadata = [
    `canvas_course_id: ${Number(courseId)}`,
    `canvas_module_id: ${yamlValue(module?.id)}`,
    `canvas_module_position: ${yamlValue(module?.position)}`,
    `canvas_module_published: ${yamlValue(module?.published)}`,
    `canvas_module_item_id: ${yamlValue(pageItem?.id)}`,
    `canvas_module_item_position: ${yamlValue(pageItem?.position)}`,
    `canvas_page_id: ${yamlValue(page?.page_id)}`,
    `canvas_page_slug: ${yamlValue(page?.url)}`,
    `canvas_page_title: ${yamlValue(page?.title)}`,
    `canvas_page_published: ${yamlValue(page?.published)}`,
    `canvas_updated_at: ${yamlValue(page?.updated_at)}`,
    `canvas_source_url: ${yamlValue(sourceUrl(module, page, pageItem))}`,
    "local_status: mirrored",
  ];
  const lines = [`# ${title}`];
  let pageBody = "";

  if (page?.body) {
    pageBody = htmlToMarkdown(page.body, document.path, pageDocumentByUrl, localFileById);
    if (pageBody) lines.push("", pageBody);
  }

  if (module) {
    const nonPageItems = module.items.filter((item) => item !== pageItem);
    const pageContainsMaterials = /^## Materialer\s*$/m.test(pageBody);
    if (nonPageItems.length && !pageContainsMaterials) {
      lines.push("", "## Materialer", "");
      for (const item of nonPageItems) renderModuleItem(lines, item, document.path, pageDocumentByUrl, localFileById);
    } else if (!page) {
      lines.push("", "*Modulet har endnu ikke indhold i Canvas.*");
    }
  }

  lines.push(
    "",
    "---",
    "",
    "<details>",
    "<summary>Canvas-metadata</summary>",
    "",
    "```yaml",
    ...metadata,
    "```",
    "",
    "</details>",
  );

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function renderModuleItem(lines, item, currentPath, pageDocumentByUrl, localFileById) {
  if (item.type === "SubHeader") {
    if (lines.at(-1) !== "") lines.push("");
    lines.push(`### ${item.title}`, "");
    return;
  }

  if (item.type === "ExternalUrl") {
    lines.push(`- [${cleanTitle(item.title)}](${item.external_url})`);
    return;
  }

  if (item.type === "File") {
    const localPath = localFileById.get(item.content_id);
    const href = localPath ? markdownRelative(currentPath, resolve(projectRoot, localPath)) : `${baseUrl}/courses/${courseId}/modules/items/${item.id}`;
    lines.push(`- [${cleanTitle(item.title)}](${href})`);
    return;
  }

  if (item.type === "Page" && item.page_url) {
    const target = pageDocumentByUrl.get(item.page_url);
    const href = target ? markdownRelative(currentPath, target.path) : `${baseUrl}/courses/${courseId}/pages/${item.page_url}`;
    lines.push(`- [${cleanTitle(item.title)}](${href})`);
    return;
  }

  lines.push(`- ${cleanTitle(item.title)} — ${item.type}`);
}

function htmlToMarkdown(html, currentPath, pageDocumentByUrl, localFileById) {
  let prepared = html;
  for (const [pageUrl, target] of pageDocumentByUrl) {
    const localHref = markdownRelative(currentPath, target.path);
    prepared = prepared
      .replaceAll(`href="/courses/${courseId}/pages/${pageUrl}"`, `href="${localHref}"`)
      .replaceAll(`href="${baseUrl}/courses/${courseId}/pages/${pageUrl}"`, `href="${localHref}"`);
  }
  for (const [fileId, localPath] of localFileById) {
    const localHref = markdownRelative(currentPath, resolve(projectRoot, localPath));
    const courseFilePattern = `(?:${escapeRegExp(baseUrl)})?/courses/${escapeRegExp(courseId)}/files/${fileId}[^\"]*`;
    prepared = prepared
      .replace(new RegExp(`href="${courseFilePattern}"`, "g"), `href="${localHref}"`)
      .replace(new RegExp(`src="${courseFilePattern}"`, "g"), `src="${localHref}"`);
  }
  prepared = prepared
    .replace(
      /href="https:\/\/github\.com\/cederdorff\/wu-e26a\/(?:blob|tree)\/main\/([^"?#]+)"/g,
      (_match, repoPath) => `href="${markdownRelative(currentPath, resolve(projectRoot, decodeURIComponent(repoPath)))}"`,
    )
    .replace(
      'href="https://raw.githack.com/cederdorff/wu-e26a/main/slides/node-express/index.html"',
      `href="${markdownRelative(currentPath, resolve(projectRoot, "slides/node-express"))}/"`,
    );

  const turndown = new TurndownService({
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    headingStyle: "atx",
    strongDelimiter: "**",
  });
  turndown.use(gfm);
  turndown.remove(["script", "style"]);
  return turndown.turndown(prepared)
    .replace(/^# /gm, "## ")
    .replace(/^### /gm, "## ")
    .replace(/^\* \* \*$/gm, "---")
    .replace(/^(\s*)-\s{3}/gm, "$1- ")
    .replaceAll(" ", " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderModuleIndex(course, modules, documents, pageDocumentByUrl, localFileById) {
  const documentByModuleId = new Map(documents.filter((document) => document.module).map((document) => [document.module.id, document]));
  const lines = [
    `# Canvas-moduler · ${course.name}`,
    "",
    `Senest hentet: ${currentManifest.pulled_at}`,
    "",
    `Kursus: [${course.name}](${baseUrl}/courses/${courseId})`,
    "",
  ];

  for (const module of modules) {
    const document = documentByModuleId.get(module.id);
    const status = module.published ? "publiceret" : "upubliceret";
    lines.push(`## ${pad(module.position)} · ${module.name}`, "", `[Lokal fil](${markdownRelative(resolve(projectRoot, "canvas/moduler.md"), document.path)}) · ${status}`, "");
    if (!module.items.length) {
      lines.push("*Ingen Canvas-elementer.*", "");
      continue;
    }
    for (const item of module.items) renderModuleItem(lines, item, resolve(projectRoot, "canvas/moduler.md"), pageDocumentByUrl, localFileById);
    lines.push("");
  }

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

async function updateReadmeOverview(course, modules, documents) {
  const readmePath = resolve(projectRoot, "README.md");
  const startMarker = "<!-- CANVAS_OVERSIGT_START -->";
  const endMarker = "<!-- CANVAS_OVERSIGT_SLUT -->";
  const readme = await readFile(readmePath, "utf8");
  const start = readme.indexOf(startMarker);
  const end = readme.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("README.md mangler markørerne til den genererede Canvas-oversigt.");
  }

  const documentByModuleId = new Map(
    documents.filter((document) => document.module).map((document) => [document.module.id, document]),
  );
  const orphanDocuments = documents.filter((document) => document.kind === "orphan-page");
  const sections = [{ title: "Generelt", entries: [] }];
  let currentSection = sections[0];

  for (const module of modules) {
    const document = documentByModuleId.get(module.id);
    if (module.name.trim().startsWith("➡️")) {
      currentSection = { title: module.name.replace(/^➡️\s*/, ""), entries: [] };
      sections.push(currentSection);
      currentSection.entries.push(moduleOverviewLine(module, document, "Forløbsoversigt og fælles materialer"));
      continue;
    }
    currentSection.entries.push(moduleOverviewLine(module, document));
  }

  const lines = [];
  for (const section of sections) {
    lines.push(`### ${section.title}`, "", ...section.entries, "");
  }
  if (orphanDocuments.length) {
    lines.push("### Øvrige Canvas-sider", "");
    for (const document of orphanDocuments) {
      const status = document.page.published ? "" : " — *kladde i Canvas*";
      lines.push(`- [${document.path.match(/\/(\d{3})-/)?.[1]} · ${document.page.title}](${markdownRelative(readmePath, document.path)})${status}`);
    }
    lines.push("");
  }

  const overview = lines.join("\n").trim();
  const updated = `${readme.slice(0, start + startMarker.length)}\n${overview}\n${readme.slice(end)}`;
  await atomicWrite(readmePath, updated);
}

function moduleOverviewLine(module, document, label = module.name) {
  const number = pad(module.position);
  const status = module.published ? "" : " — *kladde i Canvas*";
  return `- [${number} · ${label}](${markdownRelative(resolve(projectRoot, "README.md"), document.path)})${status}`;
}

async function downloadFiles(canvasFiles, folderById) {
  const usedPaths = new Set();
  const records = [];
  for (const file of canvasFiles) {
    const folder = folderById.get(file.folder_id);
    const folderSegments = (folder?.full_name ?? "")
      .split("/")
      .filter(Boolean)
      .filter((segment) => segment.toLowerCase() !== "course files")
      .map(safePathSegment);
    let filename = safePathSegment(file.display_name || file.filename || `file-${file.id}`);
    let localPath = resolve(filesRoot, ...folderSegments, filename);
    if (usedPaths.has(localPath)) {
      const dot = filename.lastIndexOf(".");
      filename = dot > 0 ? `${filename.slice(0, dot)}-${file.id}${filename.slice(dot)}` : `${filename}-${file.id}`;
      localPath = resolve(filesRoot, ...folderSegments, filename);
    }
    usedPaths.add(localPath);

    await mkdir(dirname(localPath), { recursive: true });
    const shouldDownload = !(await fileExists(localPath)) || (await readFile(localPath)).byteLength !== file.size;
    if (shouldDownload) {
      const response = await fetch(file.url, { headers: authHeaders(), redirect: "follow" });
      if (!response.ok) throw new Error(`Kunne ikke hente Canvas-fil ${file.id}: ${response.status} ${response.statusText}`);
      await atomicWrite(localPath, new Uint8Array(await response.arrayBuffer()));
    }

    records.push({
      id: file.id,
      folder_id: file.folder_id,
      display_name: file.display_name,
      filename: file.filename,
      content_type: file["content-type"],
      size: file.size,
      created_at: file.created_at,
      updated_at: file.updated_at,
      locked: file.locked,
      hidden: file.hidden,
      local_path: relative(projectRoot, localPath).replaceAll("\\", "/"),
    });
  }
  return records;
}

async function writeMirroredFile(path, contents) {
  const relativePath = relative(projectRoot, path).replaceAll("\\", "/");
  const nextHash = hash(contents);
  const previous = previousManifest.files?.[relativePath];
  const exists = await fileExists(path);

  if (exists) {
    const current = await readFile(path, "utf8");
    const currentHash = hash(current);
    if (!force && previous && currentHash !== previous.local_hash) {
      const incomingPath = resolve(incomingRoot, relativePath);
      await mkdir(dirname(incomingPath), { recursive: true });
      await atomicWrite(incomingPath, contents);
      conflicts.push(relativePath);
      currentManifest.files[relativePath] = previous;
      return "unchanged";
    }
    if (!force && !previous && currentHash !== nextHash) {
      const incomingPath = resolve(incomingRoot, relativePath);
      await mkdir(dirname(incomingPath), { recursive: true });
      await atomicWrite(incomingPath, contents);
      conflicts.push(relativePath);
      currentManifest.files[relativePath] = { local_hash: currentHash, canvas_hash: nextHash };
      return "unchanged";
    }
    if (currentHash === nextHash) {
      currentManifest.files[relativePath] = { local_hash: currentHash, canvas_hash: nextHash };
      return "unchanged";
    }
  }

  await mkdir(dirname(path), { recursive: true });
  await atomicWrite(path, contents);
  currentManifest.files[relativePath] = { local_hash: nextHash, canvas_hash: nextHash };
  return exists ? "updated" : "created";
}

async function removeObsoleteMirrorFiles(oldManifest, newManifest) {
  for (const relativePath of Object.keys(oldManifest.files ?? {})) {
    if (newManifest.files[relativePath]) continue;
    const absolutePath = resolve(projectRoot, relativePath);
    if (!absolutePath.startsWith(`${teachingRoot}/`)) continue;
    if (!(await fileExists(absolutePath))) continue;
    const currentHash = hash(await readFile(absolutePath, "utf8"));
    if (force || currentHash === oldManifest.files[relativePath].local_hash) await rm(absolutePath);
  }
}

async function writeGeneratedFile(path, contents) {
  await mkdir(dirname(path), { recursive: true });
  await atomicWrite(path, contents);
}

async function writeGeneratedJson(path, value) {
  await writeGeneratedFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function atomicWrite(path, contents) {
  const tempPath = `${path}.tmp-${process.pid}`;
  await writeFile(tempPath, contents);
  await rename(tempPath, path);
}

async function canvasRequest(url) {
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) throw new Error(`Canvas API ${response.status} ${response.statusText}: ${await response.text()}`);
  return response.json();
}

async function canvasList(initialUrl) {
  const values = [];
  let url = initialUrl;
  while (url) {
    const response = await fetch(url, { headers: authHeaders() });
    if (!response.ok) throw new Error(`Canvas API ${response.status} ${response.statusText}: ${await response.text()}`);
    values.push(...await response.json());
    url = nextPage(response.headers.get("link"));
  }
  return values;
}

function authHeaders() {
  return { Accept: "application/json", Authorization: `Bearer ${token}` };
}

function nextPage(linkHeader) {
  if (!linkHeader) return null;
  const next = linkHeader.split(",").map((value) => value.trim()).find((value) => /rel="next"/.test(value));
  return next?.match(/<([^>]+)>/)?.[1] ?? null;
}

async function mapLimit(values, limit, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return results;
}

function selectCourse(course) {
  return {
    id: course.id,
    name: course.name,
    course_code: course.course_code,
    workflow_state: course.workflow_state,
    start_at: course.start_at,
    end_at: course.end_at,
    time_zone: course.time_zone,
    default_view: course.default_view,
    is_public: course.is_public,
  };
}

function sourceUrl(module, page, pageItem) {
  if (pageItem) return `${baseUrl}/courses/${courseId}/modules/items/${pageItem.id}`;
  if (page) return `${baseUrl}/courses/${courseId}/pages/${page.url}`;
  if (module) return `${baseUrl}/courses/${courseId}/modules/${module.id}`;
  return null;
}

function markdownRelative(fromFile, toFile) {
  const path = relative(dirname(fromFile), toFile).replaceAll("\\", "/");
  const encoded = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return encoded.startsWith(".") ? encoded : `./${encoded}`;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanTitle(title) {
  return String(title ?? "").replace(/\s+/g, " ").trim();
}

function safePathSegment(value) {
  return String(value).replace(/[/:]/g, "-").replace(/\0/g, "").trim() || "uden-navn";
}

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("æ", "ae")
    .replaceAll("Æ", "ae")
    .replaceAll("ø", "oe")
    .replaceAll("Ø", "oe")
    .replaceAll("å", "aa")
    .replaceAll("Å", "aa")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pad(number) {
  return String(number).padStart(3, "0");
}

function byPosition(a, b) {
  return (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER);
}

function yamlValue(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  return JSON.stringify(value);
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} mangler i .env.`);
  return value;
}

async function loadLocalEnv(path) {
  const source = await readFile(path, "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || line.trimStart().startsWith("#")) continue;
    const [, name, rawValue] = match;
    if (process.env[name] === undefined) process.env[name] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
  }
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfPresent(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
