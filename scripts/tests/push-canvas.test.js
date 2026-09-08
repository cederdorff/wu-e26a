import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

const projectRoot = resolve(import.meta.dirname, "../..");

test("push selects Git changes without requiring a Canvas mirror", async (t) => {
  const root = await mkdtemp(resolve(tmpdir(), "canvas-push-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(resolve(root, "scripts"));
  await mkdir(resolve(root, "undervisning"));
  for (const name of ["push-canvas.js", "canvas-lib.js"]) {
    await cp(resolve(projectRoot, "scripts", name), resolve(root, "scripts", name));
  }
  await cp(resolve(projectRoot, "package.json"), resolve(root, "package.json"));
  await symlink(resolve(projectRoot, "node_modules"), resolve(root, "node_modules"), "dir");
  await writeFile(resolve(root, ".gitignore"), "node_modules/\n.canvas-push-preview/\nrequests.jsonl\n");
  await writeFile(resolve(root, "mock-api.mjs"), `
    import { appendFileSync } from "node:fs";
    globalThis.fetch = async (url, init = {}) => {
      appendFileSync("requests.jsonl", JSON.stringify({ url, ...init }) + "\\n");
      if (process.env.FAIL_API) return new Response("Test failure", { status: 500 });
      return Response.json({ title: "Lesson", url: "lesson", updated_at: "newer-than-local" });
    };
  `);
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const page = (id, body) => `# Lesson\n\n${body}\n\n---\n\n<details>\n<summary>Canvas-metadata</summary>\n\n\`\`\`yaml\ncanvas_page_id: ${id}\ncanvas_page_slug: "lesson-${id}"\ncanvas_updated_at: "old"\n\`\`\`\n</details>\n`;
  const writePage = (id, body) => writeFile(resolve(root, `undervisning/${id}.md`), page(id, body));
  const commit = (message) => { git("add", "."); git("commit", "-qm", message); return git("rev-parse", "HEAD"); };
  const run = async (args, extraEnv = {}) => {
    await writeFile(resolve(root, "requests.jsonl"), "");
    const result = spawnSync(process.execPath, ["--import", "./mock-api.mjs", "scripts/push-canvas.js", ...args], {
      cwd: root, encoding: "utf8",
      env: { ...process.env, CANVAS_BASE_URL: "https://canvas.test", CANVAS_COURSE_ID: "1", CANVAS_ACCESS_TOKEN: "fake", ...extraEnv },
    });
    const requests = (await readFile(resolve(root, "requests.jsonl"), "utf8")).trim().split("\n").filter(Boolean).map(JSON.parse);
    return { ...result, requests, puts: requests.filter((request) => request.method === "PUT") };
  };

  git("init", "-q");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  await writePage(1, "Old one");
  await writePage(2, "Old two");
  const initial = commit("Initial pages");
  await writePage(1, "Changed [other page](./2.md)");
  commit("Change first page");
  await writePage(2, "Changed two");
  commit("Change second page");

  const dryRun = await run([`--since=${initial}`]);
  assert.equal(dryRun.status, 0, dryRun.stderr);
  assert.equal(dryRun.requests.length, 2);
  assert.equal(dryRun.puts.length, 0);
  const firstPush = await run([`--since=${initial}`, "--apply"]);
  assert.equal(firstPush.status, 0, firstPush.stderr);
  assert.equal(firstPush.puts.length, 2, "includes all commits in the push");
  assert.match(JSON.parse(firstPush.puts[0].body).wiki_page.body, /https:\/\/canvas.test\/courses\/1\/pages\/lesson-2/);
  assert.deepEqual(Object.keys(JSON.parse(firstPush.puts[0].body).wiki_page), ["body"]);

  await writePage(1, "Next edit");
  commit("Edit previously pushed page");
  const secondPush = await run(["--since=HEAD~1", "--apply"]);
  assert.equal(secondPush.status, 0, secondPush.stderr);
  assert.equal(secondPush.puts.length, 1, "next push works with old local timestamps and no mirror");
  assert.match(secondPush.puts[0].url, /page_id:1$/);

  const clean = await run(["--apply"]);
  assert.equal(clean.status, 0, clean.stderr);
  assert.equal(clean.requests.length, 0);
  await writePage(2, "Uncommitted edit");
  const local = await run(["--apply"]);
  assert.equal(local.status, 0, local.stderr);
  assert.equal(local.puts.length, 1);
  assert.match(local.puts[0].url, /page_id:2$/);

  git("checkout", "--", "undervisning/2.md");
  git("rm", "undervisning/2.md");
  await writeFile(resolve(root, "undervisning/README.md"), "# Documentation\n");
  commit("Delete local page and update docs");
  const deletion = await run(["--since=HEAD~1", "--apply"]);
  assert.equal(deletion.status, 0, deletion.stderr);
  assert.equal(deletion.requests.length, 0);

  const firstBranchPush = await run([`--since=${"0".repeat(40)}`, "--apply"]);
  assert.equal(firstBranchPush.status, 0, firstBranchPush.stderr);
  assert.equal(firstBranchPush.puts.length, 1);
  const failed = await run(["undervisning/1.md", "--apply"], { FAIL_API: "1" });
  assert.notEqual(failed.status, 0, "API failures fail the workflow");
  const invalid = await run(["--since=missing-commit", "--apply"]);
  assert.notEqual(invalid.status, 0, "missing base must not push all pages");
  assert.equal(invalid.requests.length, 0);
});
