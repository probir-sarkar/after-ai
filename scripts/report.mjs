#!/usr/bin/env node
/**
 * Builds the monthly After AI report as a PDF, from the same content the
 * website renders. Nothing is copied: jobs come from src/content/jobs (the
 * job.json + notes.mdx pairs), essays from src/content/sections, the test
 * wording and verdict readings from src/lib/site.ts, and every claim keeps
 * the source id it carries on the site, resolved against src/data/sources.ts.
 *
 *   node scripts/report.mjs
 *
 * Writes report/report.html → WeasyPrint → report/after-ai-<slug>.pdf.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "report");

const MONTH = "October 2026";
const SLUG = "2026-10";

// site.ts is plain TS with no JSX, so node's type stripping reads it directly.
const { testLabels, readProfile, protectionWord, verdictMeta } = await import(
  `file://${join(ROOT, "src/lib/site.ts")}`
);
const { sources } = await import(`file://${join(ROOT, "src/data/sources.ts")}`);
const sourceById = new Map(sources.map((s) => [s.id, s]));
const cite = (id) => {
  const s = sourceById.get(id.trim());
  return s ? s.short : id;
};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** MDX-lite → HTML: Cite tags become bracketed source shorts, then markdown. */
function mdxToHtml(text, ref = "x") {
  const cites = [];
  let out = String(text ?? "").replace(/<Cite\s+ids="([^"]+)"\s*\/>/g, (_, ids) => {
    cites.push(ids.split(",").map(cite).join("; "));
    return `<sup>[${cites.length}]</sup>`;
  });
  out = out.replace(/<[^>]+>/g, ""); // no other components are allowed in this copy
  out = out
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const paras = out
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, " ")}</p>`);
  const notes = cites
    .map((c, i) => `<li id="fn-${ref}-${i + 1}"><sup>[${i + 1}]</sup> ${esc(c)}</li>`)
    .join("");
  return { html: paras.join("\n"), notes };
}

// ---------- data ----------
const jobDirs = readdirSync(join(ROOT, "src", "content", "jobs"));
const jobs = jobDirs
  .map((dir) => {
    const dirPath = join(ROOT, "src", "content", "jobs", dir);
    if (!existsSync(join(dirPath, "job.json"))) return null;
    const job = JSON.parse(readFileSync(join(dirPath, "job.json"), "utf8"));
    const notesPath = join(dirPath, "notes.mdx");
    const notes = existsSync(notesPath) ? readFileSync(notesPath, "utf8") : "";
    return { ...job, slug: dir, notes };
  })
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));

const sections = readdirSync(join(ROOT, "src", "content", "sections"))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const raw = readFileSync(join(ROOT, "src", "content", "sections", f), "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    return { ...parseYaml(m[1]), body: m[2].trim() };
  })
  .sort((a, b) => String(a.eyebrow).localeCompare(String(b.eyebrow)));

function parseYaml(text) {
  // frontmatter here is flat key: "value" lines — no nesting, so no yaml dep.
  const data = {};
  for (const line of text.split("\n")) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) {
      let v = kv[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/\\"/g, '"');
      data[kv[1]] = v;
    }
  }
  return data;
}

// ---------- job entries ----------
const testWords = (v) => (v === 2 ? "yes" : v === 1 ? "a little" : "no");

const jobEntries = jobs
  .map((j) => {
    const profile = readProfile(j.tests ?? { body: 0, accountability: 0, relationship: 0, bundle: 0 }, j.verdict);
    const vm = verdictMeta[j.verdict] ?? {};
    const tests = testLabels
      .map((t) => `<li><span class="t-word">${testWords(j.tests?.[t.key] ?? 0)}</span> ${esc(t.label)}</li>`)
      .join("");
    const metrics = (j.metrics ?? [])
      .map(
        (m) =>
          `<li><span class="m-display">${esc(m.display)}</span> ${esc(m.label)} <span class="m-src">[${esc(cite(m.source))}]</span></li>`,
      )
      .join("");
    const claims = (j.claims ?? [])
      .map((c) => `<li>${esc(c.text)} <span class="m-src">[${esc(cite(c.source))}]</span></li>`)
      .join("");
    const why = (j.why ?? []).map((w) => `<li>${esc(w)}</li>`).join("");
    const threats = (j.threats ?? []).map((w) => `<li>${esc(w)}</li>`).join("");
    const notes = mdxToHtml(j.notes, `job-${j.slug}`);
    return `
    <section class="entry" id="job-${esc(j.slug)}">
      <p class="e-k">${esc(vm.label ?? j.verdict)} · ${esc(j.category ?? "")}${j.horizon ? ` · ${esc(j.horizon)}` : ""}</p>
      <h2>${esc(j.name)}</h2>
      <p class="e-lede">${esc(j.oneLiner)}</p>
      <p class="e-protect">${esc(protectionWord(profile.total))} — ${esc(profile.reading)}</p>
      <ul class="e-tests">${tests}</ul>
      ${metrics ? `<div class="e-block"><p class="b-h">The numbers</p><ul class="e-list metrics">${metrics}</ul></div>` : ""}
      ${claims ? `<div class="e-block"><p class="b-h">What the evidence says</p><ul class="e-list">${claims}</ul></div>` : ""}
      ${why ? `<div class="e-block"><p class="b-h">What holds</p><ul class="e-list">${why}</ul></div>` : ""}
      ${threats ? `<div class="e-block"><p class="b-h">What could still go wrong</p><ul class="e-list">${threats}</ul></div>` : ""}
      ${notes.html ? `<div class="e-block"><p class="b-h">The close reading</p>${notes.html}</div>` : ""}
      ${notes.notes ? `<ul class="footnotes">${notes.notes}</ul>` : ""}
    </section>`;
  })
  .join("\n");

// ---------- essays ----------
const essayChapters = sections
  .map((s) => {
    const parsed = mdxToHtml(s.body, `section-${s.key}`);
    return `
    <section class="essay" id="section-${esc(s.key)}">
      <p class="e-k">${esc(s.eyebrow)} · ${esc(s.title)}</p>
      <h2>${esc(s.standfirst)}</h2>
      ${parsed.html}
      ${parsed.notes ? `<ul class="footnotes">${parsed.notes}</ul>` : ""}
    </section>`;
  })
  .join("\n");

// ---------- month in numbers ----------
const allMetrics = jobs.flatMap((j) => (j.metrics ?? []).map((m) => ({ job: j.short ?? j.name, ...m })));
const metricsTable = allMetrics
  .map(
    (m) =>
      `<tr><td>${esc(m.job)}</td><td>${esc(m.label)}</td><td class="num">${esc(m.display)}</td><td class="src">${esc(cite(m.source))}</td></tr>`,
  )
  .join("\n");

const verdictTally = jobs.reduce((acc, j) => ((acc[j.verdict] = (acc[j.verdict] ?? 0) + 1), acc), {});
const tallyRow = Object.entries(verdictTally)
  .map(([v, n]) => `<li><b>${n}</b> ${esc(verdictMeta[v]?.label ?? v)}</li>`)
  .join("");

const sourceRows = sources
  .map(
    (s) =>
      `<li><span class="s-short">[${esc(s.short)}]</span> ${esc(s.title)} — ${esc(s.publisher)}, ${s.year}. <span class="s-url">${esc(s.url)}</span>${s.note ? `<br><span class="s-note">${esc(s.note)}</span>` : ""}</li>`,
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>After AI — the jobs report, ${MONTH}</title>
<meta name="author" content="After AI">
<meta name="description" content="${jobs.length} jobs, ${allMetrics.length} numbers and ${sections.length} essays on what AI is doing to work, with every claim sourced.">
<style>
  @page {
    size: A4;
    margin: 20mm 20mm 20mm;
    @bottom-center { content: counter(page); font-family: Georgia, serif; font-size: 8.5pt; color: #8b8b83; }
    @top-right { content: "After AI · ${MONTH}"; font-family: Georgia, serif; font-size: 7.5pt; letter-spacing: 0.08em; color: #9a9a92; }
  }
  @page cover { margin: 0; @bottom-center { content: none } @top-right { content: none } }
  @page plain { @top-right { content: none } }

  body { font-family: Georgia, "Times New Roman", serif; color: #22221f; line-height: 1.5; margin: 0; font-size: 10pt; }
  h1, h2 { font-weight: 600; }

  .cover { page: cover; height: 297mm; padding: 0; display: flex; flex-direction: column; }
  .cover-top { background: #101b17; color: #f2efe6; padding: 28mm 22mm 20mm; }
  .cover-kicker { font-size: 8pt; letter-spacing: 0.3em; text-transform: uppercase; color: #9db894; margin: 0 0 14mm; font-family: Georgia, serif; }
  .cover h1 { font-size: 42pt; line-height: 1.04; margin: 0 0 8mm; color: #fdfbf3; }
  .cover-sub { font-size: 12pt; line-height: 1.45; max-width: 110mm; margin: 0 0 8mm; color: #d9d6c8; }
  .cover-note { font-size: 9pt; color: #9db894; margin: 0; }
  .cover-band { flex: 1; background: #f0ece1; display: flex; flex-direction: column; justify-content: center; padding: 14mm 22mm 10mm; }
  .cover-band .big { font-family: Georgia, serif; font-size: 14.5pt; line-height: 1.45; color: #22221f; margin: 0 0 4mm; }
  .cover-band .small { font-size: 10pt; line-height: 1.55; color: #3c3c37; margin: 0; max-width: 130mm; }
  .cover-foot { background: #101b17; color: #9db894; padding: 6mm 22mm; display: flex; justify-content: space-between; font-size: 7.4pt; letter-spacing: 0.12em; text-transform: uppercase; }

  .front { page: plain; break-before: page; }
  .front h1 { font-size: 19pt; margin: 0 0 4mm; }
  .front p { max-width: 122mm; margin: 0 0 3.2mm; }

  .tally-h, .tbl-h { font-size: 15pt; margin: 8mm 0 3mm; }
  ul.tally { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 4mm 8mm; }
  ul.tally li { font-size: 10pt; }

  table.metrics { width: 100%; border-collapse: collapse; font-size: 8.4pt; }
  table.metrics td, table.metrics th { text-align: left; padding: 1.6mm 2mm 1.6mm 0; border-bottom: 0.3pt solid #d8d5cb; vertical-align: top; }
  table.metrics td.num { white-space: nowrap; font-weight: bold; }
  table.metrics td.src, table.metrics th.src { color: #8b8b83; white-space: nowrap; }

  .entry, .essay { break-before: page; }
  .e-k { font-size: 7.5pt; letter-spacing: 0.16em; text-transform: uppercase; color: #8b8b83; margin: 0 0 2mm; }
  .entry h2 { font-size: 19pt; line-height: 1.12; margin: 0 0 2.5mm; string-set: entrytitle content(); break-after: avoid; }
  .essay h2 { font-size: 17pt; line-height: 1.2; margin: 0 0 4mm; }
  .e-lede { font-size: 11.5pt; line-height: 1.4; margin: 0 0 3mm; color: #3c3c37; }
  .e-protect { font-size: 9pt; margin: 0 0 3mm; color: #5d5d55; }
  .e-tests { list-style: none; padding: 2.5mm 0 0; margin: 0 0 2mm; border-top: 0.3pt solid #d8d5cb; }
  .e-tests li { font-size: 8.6pt; margin: 0 0 1mm; color: #3c3c37; }
  .t-word { display: inline-block; min-width: 18mm; font-weight: bold; }
  .e-block { margin: 4mm 0 0; }
  .b-h { font-size: 7pt; letter-spacing: 0.18em; text-transform: uppercase; color: #8b8b83; margin: 0 0 1.5mm; }
  .e-block p { margin: 0 0 2.4mm; }
  ul.e-list, ul.footnotes { list-style: none; padding: 0; margin: 0; }
  ul.e-list li { font-size: 9pt; line-height: 1.45; margin: 0 0 1.8mm; }
  .m-display { font-weight: bold; }
  .m-src, sup { color: #8b8b83; font-size: 0.85em; }
  ul.footnotes { margin: 3mm 0 0; border-top: 0.3pt solid #d8d5cb; padding-top: 2mm; }
  ul.footnotes li { font-size: 7.6pt; color: #8b8b83; margin: 0 0 1mm; }
  sup a, a { color: inherit; text-decoration: none; }

  .credits, .sources { page: plain; break-before: page; }
  .sources h1, .credits h1 { font-size: 19pt; margin: 0 0 4mm; }
  ul.sources-list { list-style: none; padding: 0; margin: 0; }
  ul.sources-list li { font-size: 8.4pt; line-height: 1.45; padding: 1.6mm 0; border-bottom: 0.3pt solid #e0ddd4; }
  .s-short { font-weight: bold; }
  .s-url { color: #8b8b83; font-size: 0.92em; }
  .s-note { color: #6b6b62; }
</style>
</head>
<body>

<section class="cover">
  <div class="cover-top">
    <p class="cover-kicker">After AI · Monthly report</p>
    <h1>The jobs report:<br>${MONTH}</h1>
    <p class="cover-sub">What the data says about which work AI is changing — ${jobs.length} jobs, ${allMetrics.length} numbers, ${sections.length} essays. Every claim carries its source.</p>
    <p class="cover-note">after-ai.browserstay.com · free · nothing collected</p>
  </div>
  <div class="cover-band">
    <p class="big">Of ${jobs.length} jobs: ${verdictTally["at-risk"] ?? 0} at risk, ${verdictTally["survives"] ?? 0} hold, ${verdictTally["mixed"] ?? 0} split in two, ${verdictTally["possible"] ?? 0} watching briefs, ${verdictTally["emerging"] ?? 0} born of AI.</p>
    <p class="small">The verdicts come from four tests — a body, accountability, a relationship, and whether the role holds together — read against the published data, not from opinion. Every number in this report is reprinted with the study it came from.</p>
  </div>
  <div class="cover-foot"><span>after-ai.browserstay.com</span><span>${MONTH}</span></div>
</section>

<section class="front">
  <h1>How to read this report</h1>
  <p>Every job on After AI is scored against four questions. They are not a score out of twelve and they are not a grade; they are the four things that have actually kept work out of a machine's reach so far. ${testLabels.map((t) => t.label).join("; ")}.</p>
  <p>Each job also carries a verdict — survives, at risk, mixed, emerging, or possible — and the verdict is part of the reading: an AI-native job scores low on protection because it never needed protecting, which is not the same as being exposed.</p>
  <p>Nothing in this report is a forecast of our own. The numbers are transcribed from the studies named beside them, and where a study measures exposure or applicability rather than job loss, the caption says so. The full bibliography is at the back.</p>

  <h1 class="tally-h">The month at a glance</h1>
  <ul class="tally">${tallyRow}</ul>
  <p>Across ${jobs.length} tracked jobs: ${verdictTally["survives"] ?? 0} keep their shape, ${(verdictTally["at-risk"] ?? 0) + (verdictTally["mixed"] ?? 0)} are exposed in whole or in part, ${verdictTally["emerging"] ?? 0} are AI-native, and ${verdictTally["possible"] ?? 0} are watching briefs.</p>

  <h1 class="tbl-h">Every number in the report</h1>
  <table class="metrics">
    <tr><th>Job</th><th>Measure</th><th>Value</th><th class="src">Source</th></tr>
    ${metricsTable}
  </table>
</section>

${jobEntries}

<section class="front">
  <h1>The essays</h1>
  <p>Five short pieces on what the numbers mean together: what is at risk, what survives, what to do, what is coming, and where the opportunity sits. Each is reprinted from the site with its citations intact.</p>
</section>
${essayChapters}

<section class="sources">
  <h1>Sources</h1>
  <ul class="sources-list">${sourceRows}</ul>
</section>

</body>
</html>
`;

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "report.html"), html);
console.log(`report: ${jobs.length} jobs, ${allMetrics.length} metrics, ${sections.length} essays → report/report.html`);
