// Delte lav-niveau hjælpefunktioner for pull-canvas.js og push-canvas.js:
// .env-indlæsning, Canvas API-kald, hashing og fil-I/O.

import { createHash } from "node:crypto";
import { access, readFile, rename, writeFile } from "node:fs/promises";

export async function loadLocalEnv(path) {
  const source = await readFile(path, "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || line.trimStart().startsWith("#")) continue;
    const [, name, rawValue] = match;
    if (process.env[name] === undefined) process.env[name] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
  }
}

export function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} mangler i .env.`);
  return value;
}

export function authHeaders(token) {
  return { Accept: "application/json", Authorization: `Bearer ${token}` };
}

export async function canvasRequest(url, token, init = {}) {
  const response = await fetch(url, { ...init, headers: { ...authHeaders(token), ...init.headers } });
  if (!response.ok) throw new Error(`Canvas API ${response.status} ${response.statusText}: ${await response.text()}`);
  return response.json();
}

export async function canvasList(initialUrl, token) {
  const values = [];
  let url = initialUrl;
  while (url) {
    const response = await fetch(url, { headers: authHeaders(token) });
    if (!response.ok) throw new Error(`Canvas API ${response.status} ${response.statusText}: ${await response.text()}`);
    values.push(...await response.json());
    url = nextPage(response.headers.get("link"));
  }
  return values;
}

function nextPage(linkHeader) {
  if (!linkHeader) return null;
  const next = linkHeader.split(",").map((value) => value.trim()).find((value) => /rel="next"/.test(value));
  return next?.match(/<([^>]+)>/)?.[1] ?? null;
}

export async function mapLimit(values, limit, mapper) {
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

export function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

export async function atomicWrite(path, contents) {
  const tempPath = `${path}.tmp-${process.pid}`;
  await writeFile(tempPath, contents);
  await rename(tempPath, path);
}

export async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonIfPresent(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
