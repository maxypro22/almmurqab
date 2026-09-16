/**
 * Al Murqab Law — SEO build for the static Hostinger site.
 *
 *   node build.mjs          validate all content, then regenerate ../hostinger-site
 *   node build.mjs --draft  build even when content has errors (preview only;
 *                           items with errors are left out)
 *
 * ../hostinger-site is rebuilt from ./base (the untouched static export) on
 * every run, so the build never patches its own output. Never edit files in
 * hostinger-site by hand: they are overwritten.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SITE, LOCALES, CONTENT_UPDATED, FIRM, PRACTICE, LANDING, PAGES, L, practiceBySlug } from "./lib/site.mjs";
import { esc, jsonLd, inspectFragment, countWords } from "./lib/html.mjs";
import * as T from "./lib/templates.mjs";
import HOME from "./content/home.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(ROOT, "base");
const OUT = path.resolve(ROOT, "..", "hostinger-site");
const DRAFT = process.argv.includes("--draft");

const errors = [];
const warnings = [];
const error = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const brokenLink = DRAFT ? warn : error;

const fileFor = (loc, key) => `${loc}${key ? `/${key}` : ""}.html`;
const prefixFor = (file) => "../".repeat(file.split("/").length - 1) || "./";
const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n - 1))}…`);

/** key -> lastmod, for sitemap.xml */
const sitemap = new Map();

// =============================================================== Content

async function loadDir(dir) {
  const full = path.join(ROOT, "content", dir);
  if (!fs.existsSync(full)) return [];
  const items = [];
  for (const name of fs.readdirSync(full).filter((f) => f.endsWith(".mjs")).sort()) {
    try {
      const mod = await import(pathToFileURL(path.join(full, name)).href);
      items.push({ ...mod.default, file: `content/${dir}/${name}` });
    } catch (e) {
      error(`content/${dir}/${name}: cannot be loaded — ${e.message}`);
    }
  }
  return items;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const fileSlug = (item) => path.basename(item.file, ".mjs");

function required(where, obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v == null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length)) error(`${where}: "${k}" is missing`);
  }
}

function plain(where, obj, keys) {
  for (const k of keys) if (typeof obj?.[k] === "string" && /[<>]/.test(obj[k])) error(`${where}: "${k}" must be plain text`);
}

function meta(where, loc, c) {
  const title = `${c.metaTitle ?? ""} | ${L[loc].brand}`;
  if (c.metaTitle && title.length > 70) warn(`${where}: <title> is ${title.length} characters (Google shows about 60)`);
  const d = c.description?.length ?? 0;
  if (d && (d < 110 || d > 170)) warn(`${where}: description is ${d} characters (aim for 140–160)`);
}

function fragment(where, loc, html, known, opts) {
  if (typeof html !== "string") return;
  const { errors: problems, links } = inspectFragment(html, opts);
  problems.forEach((p) => error(`${where}: ${p}`));
  if (html.includes("${")) error(`${where}: contains "\${"`);
  for (const link of links) {
    if (/^https:\/\//.test(link) || /^(tel|mailto):/.test(link)) continue;
    if (/^http:\/\//.test(link)) {
      warn(`${where}: insecure link ${link}`);
      continue;
    }
    if (!link.startsWith("/")) {
      error(`${where}: unsupported link "${link}"`);
      continue;
    }
    const target = link.split("#")[0].replace(/\/$/, "");
    if (target !== `/${loc}` && !target.startsWith(`/${loc}/`)) error(`${where}: ${link} points at the other language`);
    else if (!known.has(target)) brokenLink(`${where}: ${link} — no such page`);
  }
}

function faqs(where, list, min) {
  if (!Array.isArray(list) || list.length < min) return error(`${where}: needs at least ${min} FAQs`);
  list.forEach((f, i) => {
    if (!f?.q?.trim() || !f?.a?.trim()) error(`${where}: FAQ ${i + 1} needs both q and a`);
    else if (/[<>]/.test(f.q + f.a)) error(`${where}: FAQ ${i + 1} must be plain text`);
  });
}

function cards(where, list, min) {
  if (!Array.isArray(list) || list.length < min) return error(`${where}: needs at least ${min} items`);
  list.forEach((s, i) => {
    if (!s?.title?.trim() || !s?.text?.trim()) error(`${where}: item ${i + 1} needs title and text`);
  });
}

function sources(where, list, expected) {
  if (!Array.isArray(list) || !list.length) {
    if (expected) warn(`${where}: no sources listed`);
    return;
  }
  list.forEach((s) => {
    if (!s?.label || !/^https:\/\//.test(s?.url ?? "")) error(`${where}: invalid source ${JSON.stringify(s)}`);
  });
}

function validateArticle(a, known) {
  if (a.slug !== fileSlug(a)) error(`${a.file}: slug "${a.slug}" must match the file name`);
  if (!practiceBySlug[a.practiceArea]) error(`${a.file}: unknown practiceArea "${a.practiceArea}"`);
  if (!DATE.test(a.published ?? "")) error(`${a.file}: published must be YYYY-MM-DD`);
  if (a.updated != null && !DATE.test(a.updated)) error(`${a.file}: updated must be YYYY-MM-DD`);
  if (!["published", "review"].includes(a.status)) error(`${a.file}: status must be "published" or "review"`);
  for (const loc of LOCALES) {
    const where = `${a.file} [${loc}]`;
    const c = a[loc];
    if (!c) {
      error(`${where}: language block missing`);
      continue;
    }
    required(where, c, ["title", "metaTitle", "description", "lede", "takeaways", "body", "faqs"]);
    plain(where, c, ["title", "metaTitle", "description", "lede"]);
    meta(where, loc, c);
    fragment(where, loc, c.body, known, { allowH2: true });
    if (Array.isArray(c.takeaways) && c.takeaways.some((t) => typeof t !== "string" || /[<>]/.test(t))) {
      error(`${where}: takeaways must be plain strings`);
    }
    const words = countWords(c.body);
    if (c.body && words < 600) warn(`${where}: body is only ${words} words`);
    faqs(where, c.faqs, 3);
  }
  sources(a.file, a.sources, true);
}

function validatePractice(p, known) {
  if (!practiceBySlug[p.slug]) error(`${p.file}: unknown practice slug "${p.slug}"`);
  if (p.slug !== fileSlug(p)) error(`${p.file}: slug must match the file name`);
  for (const loc of LOCALES) {
    const where = `${p.file} [${loc}]`;
    const c = p[loc];
    if (!c) {
      error(`${where}: language block missing`);
      continue;
    }
    required(where, c, ["metaTitle", "description", "h1", "lede", "intro", "services", "process", "body", "faqs"]);
    plain(where, c, ["metaTitle", "description", "h1", "lede"]);
    meta(where, loc, c);
    fragment(`${where} intro`, loc, c.intro, known, { allowH2: false });
    fragment(`${where} body`, loc, c.body, known, { allowH2: true });
    cards(`${where} services`, c.services, 4);
    cards(`${where} process`, c.process, 3);
    faqs(where, c.faqs, 3);
  }
  sources(p.file, p.sources, false);
}

function validateLanding(p, known) {
  if (!LANDING.some((l) => l.slug === p.slug)) error(`${p.file}: unknown landing slug "${p.slug}"`);
  if (p.slug !== fileSlug(p)) error(`${p.file}: slug must match the file name`);
  for (const loc of LOCALES) {
    const where = `${p.file} [${loc}]`;
    const c = p[loc];
    if (!c) {
      error(`${where}: language block missing`);
      continue;
    }
    required(where, c, ["metaTitle", "description", "eyebrow", "h1", "lede", "sections", "faqs", "ctaTitle", "ctaText"]);
    plain(where, c, ["metaTitle", "description", "eyebrow", "h1", "lede", "ctaTitle", "ctaText"]);
    meta(where, loc, c);
    const ids = new Set();
    (c.sections ?? []).forEach((s, i) => {
      const at = `${where} section ${i + 1}`;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s?.id ?? "")) error(`${at}: id must be lowercase kebab-case`);
      if (ids.has(s?.id)) error(`${at}: duplicate id "${s.id}"`);
      ids.add(s?.id);
      if (!s?.h2?.trim() || /[<>]/.test(s.h2)) error(`${at}: h2 must be plain text`);
      fragment(at, loc, s?.html, known, { allowH2: false });
    });
    faqs(where, c.faqs, 3);
  }
  sources(p.file, p.sources, false);
}

/** Runs a validator and reports whether the item came through without errors. */
function passes(item, validator, known) {
  const before = errors.length;
  validator(item, known);
  return errors.length === before;
}

// ================================================================= Pages

const readBase = (file) => fs.readFileSync(path.join(BASE, file), "utf8");

function writeOut(file, content) {
  const full = path.join(OUT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

function split(html, file) {
  const headStart = html.indexOf("<head>") + "<head>".length;
  const headEnd = html.indexOf("</head>");
  const mainStart = html.indexOf('<main id="main">');
  const mainEnd = html.lastIndexOf("</main>") + "</main>".length;
  if (headEnd < headStart || mainStart < headEnd || mainEnd < mainStart) throw new Error(`${file}: unexpected page structure`);
  return {
    pre: html.slice(0, headStart),
    head: html.slice(headStart, headEnd),
    mid: html.slice(headEnd, mainStart),
    main: html.slice(mainStart, mainEnd),
    post: html.slice(mainEnd),
  };
}

function insertBefore(html, marker, insert, label) {
  const i = html.indexOf(marker);
  if (i < 0) {
    warn(`${label}: insertion point not found, section skipped`);
    return html;
  }
  return html.slice(0, i) + insert + html.slice(i);
}

/**
 * Fonts worth preloading, per language: body text and display headings.
 * The export preloaded all ten (~430 KB) on every page, most of them for the
 * other language, competing with the hero image for the first paint.
 */
const FONT_PRELOAD = {
  ar: ["744885950b1fe0ff", "c9a0d344f313d307", "280fac012b00b901"],
  en: ["01e4147cff8141ee", "5d6231e6818a3930", "3347fc7792f0b5ea"],
};

let cssVersion = "";

function rewriteHead(head, loc, seoHtml, keepImagePreload) {
  const tokens = head.match(/<title>[\s\S]*?<\/title>|<script[\s\S]*?<\/script>|<[^>]+>/g) ?? [];
  const out = [];
  for (const tag of tokens) {
    if (tag.startsWith("<title>")) continue;
    if (/^<meta (?:name|property)="(?:description|robots|geo\.|ICBM|og:|twitter:|article:|theme-color)/.test(tag)) continue;
    if (/^<link rel="(?:canonical|alternate)"/.test(tag)) continue;
    if (/^<link rel="preload"[^>]*as="font"/.test(tag) && !FONT_PRELOAD[loc].some((f) => tag.includes(f))) continue;
    if (/^<link rel="preload" as="image"/.test(tag) && !keepImagePreload) continue;
    out.push(tag.replace(/style\.css\?v=\w+/, `style.css?v=${cssVersion}`));
    if (tag.startsWith('<link rel="stylesheet"')) out.push(seoHtml);
  }
  return out.join("");
}

const ORG_SCRIPT =
  /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":\["LegalService","LocalBusiness"\][\s\S]*?<\/script>/;

function patchFooter(post, loc) {
  const li = ([key, text]) => `<li class="footer-item"><a class="transition-colors hover:text-paper" href="${T.href(loc, key)}">${esc(text)}</a></li>`;
  const replaceList = (html, heading, entries) => {
    const re = new RegExp(`(<p class="footer-heading">${heading}</p><ul class="mt-5 space-y-3 text-sm">)[\\s\\S]*?(</ul>)`);
    if (!re.test(html)) {
      warn(`footer list "${heading}" not found`);
      return html;
    }
    return html.replace(re, (_, open, close) => open + entries.map(li).join("") + close);
  };
  const quick = [
    ["", L[loc].home],
    ["about", L[loc].about],
    ["practice-areas", L[loc].practiceAreas],
    ...LANDING.map((l) => [l.slug, l.title[loc]]),
    ["team", L[loc].team],
    ["insights", L[loc].insights],
    ["contact", L[loc].contact],
  ];
  const areas = PRACTICE.map((p) => [`practice-areas/${p.slug}`, p.title[loc]]);
  return replaceList(replaceList(post, L[loc].quickLinks, quick), L[loc].practiceAreas, areas);
}

function assemble(file, parts, loc, seo, main, keepImagePreload = false) {
  if (!ORG_SCRIPT.test(parts.mid)) warn(`${file}: organisation JSON-LD not found in the page shell`);
  const head = rewriteHead(parts.head, loc, T.seoTags({ loc, ...seo }), keepImagePreload);
  const mid = parts.mid.replace(ORG_SCRIPT, () => jsonLd(T.orgGraph(loc)));
  return parts.pre + head + mid + main + patchFooter(parts.post, loc);
}

/** Rewrites a page that exists in the base export. */
function patch(loc, key, { seo, image, imageAlt, keepImagePreload = false }, transform = (m) => m, lastmod = CONTENT_UPDATED) {
  const file = fileFor(loc, key);
  const parts = split(readBase(file), file);
  const main = transform(parts.main, prefixFor(file));
  writeOut(file, assemble(file, parts, loc, { key, title: seo.title, description: seo.description, image, imageAlt }, main, keepImagePreload));
  sitemap.set(key, lastmod);
}

/** Header and footer for a page with no counterpart in the base export. */
function shell(loc, key, section) {
  const file = fileFor(loc, key);
  const prefix = prefixFor(file);
  const template = `${loc}/about.html`;
  const parts = split(readBase(template), template);
  const relocate = (s) => s.replace(/(["\s,])\.\.\//g, `$1${prefix}`);
  const mid = relocate(parts.mid)
    .replace(/<a class="link-underline text-sm tracking-wide transition-colors (?:text-ink|text-ink-muted hover:text-ink)" href="([^"]*)">/g, (_, link) => {
      const active = (link.split("/")[2] ?? "") === section;
      return `<a class="link-underline text-sm tracking-wide transition-colors ${active ? "text-ink" : "text-ink-muted hover:text-ink"}" href="${link}"${
        active ? ' aria-current="page"' : ""
      }>`;
    })
    .replace(/(<a hrefLang="(?:ar|en)"[^>]*?href=")[^"]*(")/g, (_, open, close) => `${open}${T.href(T.other(loc), key)}${close}`);
  return { file, parts: { pre: parts.pre, head: relocate(parts.head), mid, main: "", post: relocate(parts.post) } };
}

// ============================================================ Crawl files

function robotsTxt() {
  const answerEngines = [
    "Googlebot",
    "Bingbot",
    "Google-Extended",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Applebot",
    "Applebot-Extended",
    "DuckAssistBot",
    "CCBot",
  ];
  return [
    "# Al Murqab Law Office — almurqablaw.com",
    "# Search engines and AI answer engines are welcome to crawl and cite this site.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    ...answerEngines.map((bot) => `User-agent: ${bot}`),
    "Allow: /",
    "",
    `Sitemap: ${SITE}/sitemap.xml`,
    "",
  ].join("\n");
}

function sitemapXml() {
  const urls = [...sitemap.entries()].flatMap(([key, lastmod]) =>
    LOCALES.map(
      (loc) =>
        `<url><loc>${T.pageUrl(loc, key)}</loc>` +
        LOCALES.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${T.pageUrl(l, key)}"/>`).join("") +
        `<xhtml:link rel="alternate" hreflang="x-default" href="${T.pageUrl("ar", key)}"/><lastmod>${lastmod}</lastmod></url>`
    )
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join(
    "\n"
  )}\n</urlset>\n`;
}

/** llms.txt: a plain summary of the firm and its content for AI assistants. */
function llmsTxt(landings, articles) {
  const u = T.pageUrl;
  return [
    `# ${FIRM.name.en} (${FIRM.name.ar})`,
    "",
    `> Qatari law firm in Doha, Qatar, providing legal consultation and representation before the Qatari courts, in Arabic and English, for individuals and companies. Practice areas: ${PRACTICE.map(
      (p) => p.title.en.toLowerCase()
    ).join(", ")}.`,
    "",
    "## Firm facts",
    `- Name: ${FIRM.name.en} — ${FIRM.name.ar}`,
    `- Address: ${FIRM.street.en}, ${FIRM.city.en}, ${FIRM.country.en}`,
    `- Phone and WhatsApp: +974 ${FIRM.phoneDisplay.en}`,
    `- Email: ${FIRM.email}`,
    `- Hours: ${FIRM.hours.en}`,
    "- Languages: Arabic, English",
    `- Founder: ${FIRM.founder.name.en}`,
    `- Website: ${SITE} (Arabic at /ar, English at /en)`,
    "",
    "## Key pages",
    `- [Home](${u("en")}): ${PAGES[""].en.description}`,
    `- [الرئيسية](${u("ar")}): ${PAGES[""].ar.description}`,
    ...landings.flatMap((p) => [`- [${p.en.h1}](${u("en", p.slug)}): ${p.en.description}`, `- [${p.ar.h1}](${u("ar", p.slug)}): ${p.ar.description}`]),
    `- [Contact](${u("en", "contact")}): ${PAGES.contact.en.description}`,
    "",
    "## Practice areas",
    ...PRACTICE.map((p) => `- [${p.title.en}](${u("en", `practice-areas/${p.slug}`)}) · [${p.title.ar}](${u("ar", `practice-areas/${p.slug}`)}): ${p.summary.en}`),
    "",
    "## Legal guides (English)",
    ...articles.map((a) => `- [${a.en.title}](${u("en", `insights/${a.slug}`)}): ${a.en.description}`),
    "",
    "## الأدلة القانونية (العربية)",
    ...articles.map((a) => `- [${a.ar.title}](${u("ar", `insights/${a.slug}`)}): ${a.ar.description}`),
    "",
    "## Notes",
    "- The guides are general information about Qatari law, not legal advice. Each lists its official sources and the date it was last updated.",
    `- To speak to a lawyer: +974 ${FIRM.phoneDisplay.en} (phone or WhatsApp) or ${FIRM.email}.`,
    "",
  ].join("\n");
}

// ================================================================== Build

async function main() {
  if (!fs.existsSync(path.join(BASE, "ar.html"))) {
    console.error("✖ seo-build/base is missing. It must hold the original static export — see README.md.");
    process.exit(1);
  }

  let articles = await loadDir("articles");
  let practices = await loadDir("practice");
  let landings = await loadDir("landing");

  const known = new Set();
  const addKnown = (key) => LOCALES.forEach((loc) => known.add(T.href(loc, key)));
  ["", "about", "contact", "team", `team/${FIRM.founder.slug}`, "practice-areas", "insights", ...PRACTICE.map((p) => `practice-areas/${p.slug}`)].forEach(addKnown);
  landings.forEach((p) => addKnown(p.slug));
  articles.forEach((a) => addKnown(`insights/${a.slug}`));

  articles = articles.filter((a) => passes(a, validateArticle, known));
  practices = practices.filter((p) => passes(p, validatePractice, known));
  landings = landings.filter((p) => passes(p, validateLanding, known));
  for (const l of LANDING) {
    if (!landings.some((p) => p.slug === l.slug)) brokenLink(`content/landing/${l.slug}.mjs is missing, but the footer and home page link to it`);
  }
  for (const slug of HOME.featured ?? []) {
    if (!articles.some((a) => a.slug === slug)) warn(`content/home.mjs: featured guide "${slug}" not found`);
  }

  warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
  errors.forEach((e) => console.error(`  ✖ ${e}`));
  if (errors.length && !DRAFT) {
    console.error(`\n✖ ${errors.length} error(s). Nothing was written. Fix them, or run with --draft to preview.`);
    process.exit(1);
  }

  // Guides marked status: "review" are checked but not published. Links to
  // them elsewhere are kept as plain text until the lawyer signs them off.
  const onHold = new Set(articles.filter((a) => a.status === "review").map((a) => a.slug));
  articles = articles.filter((a) => !onHold.has(a.slug));
  const unlink = (html) =>
    typeof html === "string"
      ? html.replace(/<a href="\/(?:ar|en)\/insights\/([a-z0-9-]+)(?:#[^"]*)?"[^>]*>([\s\S]*?)<\/a>/g, (link, slug, text) => (onHold.has(slug) ? text : link))
      : html;
  for (const loc of LOCALES) {
    for (const a of articles) a[loc].body = unlink(a[loc].body);
    for (const p of practices) Object.assign(p[loc], { intro: unlink(p[loc].intro), body: unlink(p[loc].body) });
    for (const p of landings) for (const s of p[loc].sections) s.html = unlink(s.html);
  }

  for (const a of articles) {
    a.modified = [a.updated ?? a.published, CONTENT_UPDATED].sort().pop();
    a.words = { ar: countWords(a.ar.body), en: countWords(a.en.body) };
    a.minutes = { ar: Math.max(1, Math.round(a.words.ar / 170)), en: Math.max(1, Math.round(a.words.en / 220)) };
  }
  articles.sort((x, y) => y.published.localeCompare(x.published) || x.slug.localeCompare(y.slug));

  // Fresh output from the base export.
  fs.mkdirSync(OUT, { recursive: true });
  for (const entry of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, entry), { recursive: true, force: true });
  fs.cpSync(BASE, OUT, { recursive: true });

  const cssFile = path.join(OUT, "assets", "css", "style.css");
  const css = fs.readFileSync(cssFile, "utf8") + fs.readFileSync(path.join(ROOT, "static", "extra.css"), "utf8");
  fs.writeFileSync(cssFile, css);
  cssVersion = crypto.createHash("sha1").update(css).digest("hex").slice(0, 10);

  const featured = (HOME.featured ?? []).map((s) => articles.find((a) => a.slug === s)).filter(Boolean);
  for (const a of articles) if (featured.length < 6 && !featured.includes(a)) featured.push(a);

  const relatedFor = (slugs, area, exclude) => {
    const picked = [];
    const add = (a) => {
      if (a && a.slug !== exclude && !picked.includes(a)) picked.push(a);
    };
    (slugs ?? []).forEach((s) => add(articles.find((a) => a.slug === s)));
    articles.filter((a) => a.practiceArea === area).forEach(add);
    return picked;
  };

  for (const loc of LOCALES) {
    const H = HOME[loc];

    patch(loc, "", { seo: PAGES[""][loc], keepImagePreload: true }, (main) => {
      let m = main.replace(
        /<h1 class="display mt-7([^"]*)">[\s\S]*?<\/h1>/,
        (_, cls) => `<h1 class="display mt-7${cls}"><span class="block">${esc(H.h1[0])}</span><span class="mt-2 block text-brand-100">${esc(H.h1[1])}</span></h1>`
      );
      // The first slide is the LCP image.
      m = m.replace('class="hero-slide-img object-cover"', 'fetchpriority="high" class="hero-slide-img object-cover"');
      m = insertBefore(m, '<section class="bg-slate text-paper">', T.homeSections(loc, H, featured), `${loc} home`);
      return m.replace('<main id="main">', `<main id="main">${jsonLd(T.faqLd(H.faqs))}`);
    });

    patch(loc, "about", { seo: PAGES.about[loc] }, (main, prefix) => {
      const ld = jsonLd({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${T.pageUrl(loc, "about")}#page`,
        url: T.pageUrl(loc, "about"),
        name: PAGES.about[loc].title,
        inLanguage: loc,
        isPartOf: { "@id": T.WEBSITE_ID },
        about: { "@id": T.ORG_ID },
      });
      const m = insertBefore(
        main,
        '<section class="section"><div class="shell flex flex-wrap items-center justify-between gap-8">',
        T.aboutSection(loc, H.about, prefix),
        `${loc} about`
      );
      return m.replace('<main id="main">', `<main id="main">${ld}`);
    });

    patch(loc, "contact", { seo: PAGES.contact[loc] }, (main) =>
      main.replace(
        '<main id="main">',
        `<main id="main">${jsonLd({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": `${T.pageUrl(loc, "contact")}#page`,
          url: T.pageUrl(loc, "contact"),
          name: PAGES.contact[loc].title,
          inLanguage: loc,
          isPartOf: { "@id": T.WEBSITE_ID },
          about: { "@id": T.ORG_ID },
        })}`
      )
    );

    // The founder card: the role sits centred under the name, and the one-line
    // bio repeated the role, so it goes.
    patch(loc, "team", { seo: PAGES.team[loc] }, (main) =>
      main
        .replace(/<p class="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">[^<]*<\/p>/, "")
        .replace(
          /<p class="mt-1\.5 text-xs tracking-wide text-ink-faint">/,
          '<p class="mt-1.5 text-xs tracking-wide text-ink-faint text-center">',
        ),
    );

    const founderKey = `team/${FIRM.founder.slug}`;
    patch(loc, founderKey, { seo: PAGES[founderKey][loc], image: FIRM.founder.image, imageAlt: FIRM.founder.display[loc] }, (main) =>
      // The export typed the founder as ["Person","Attorney"] (Attorney is an
      // organisation type) with empty arrays; the Person now lives in the
      // site-wide graph and this page points at it.
      main.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":\["Person","Attorney"\][\s\S]*?<\/script>/, () =>
        jsonLd({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${T.pageUrl(loc, founderKey)}#page`,
          url: T.pageUrl(loc, founderKey),
          inLanguage: loc,
          mainEntity: { "@id": T.FOUNDER_ID },
          isPartOf: { "@id": T.WEBSITE_ID },
        })
      )
    );

    const index = PAGES["practice-areas"][loc];
    patch(loc, "practice-areas", { seo: index }, (main) => {
      let m = main.replace(/(<h1 class="display mt-5 text-4xl md:text-6xl">)[^<]*(<\/h1>)/, (_, open, close) => open + esc(index.h1) + close);
      const ld = jsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${T.pageUrl(loc, "practice-areas")}#page`,
        url: T.pageUrl(loc, "practice-areas"),
        name: index.h1,
        inLanguage: loc,
        isPartOf: { "@id": T.WEBSITE_ID },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: PRACTICE.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title[loc],
            url: T.pageUrl(loc, `practice-areas/${p.slug}`),
          })),
        },
      });
      m = m.replace('<main id="main">', `<main id="main">${ld}`);
      return insertBefore(m, "</main>", T.practiceIndexSection(loc, H), `${loc} practice index`);
    });

    for (const area of PRACTICE) {
      const key = `practice-areas/${area.slug}`;
      const content = practices.find((p) => p.slug === area.slug);
      const image = area.image.jpg;
      if (!content) {
        patch(loc, key, {
          seo: { title: `${L[loc].inQatar(area.title[loc])} | ${L[loc].brand}`, description: clip(area.summary[loc], 158) },
          image,
          imageAlt: area.title[loc],
          keepImagePreload: true,
        });
        continue;
      }
      const t = content[loc];
      patch(
        loc,
        key,
        { seo: { title: `${t.metaTitle} | ${L[loc].brand}`, description: t.description }, image, imageAlt: t.h1, keepImagePreload: true },
        (main, prefix) => T.practiceMain(loc, content, relatedFor(content.relatedArticles, area.slug).slice(0, 4), prefix)
      );
    }

    patch(loc, "insights", { seo: PAGES.insights[loc] }, () => T.insightsMain(loc, articles));

    for (const a of articles) {
      const key = `insights/${a.slug}`;
      const area = practiceBySlug[a.practiceArea];
      const related = relatedFor([], a.practiceArea, a.slug);
      for (const x of featured) if (related.length < 3 && x.slug !== a.slug && !related.includes(x)) related.push(x);
      const { file, parts } = shell(loc, key, "insights");
      const seo = {
        key,
        title: `${a[loc].metaTitle} | ${L[loc].brand}`,
        description: a[loc].description,
        ogType: "article",
        image: area.image.jpg,
        imageAlt: a[loc].title,
        article: { published: a.published, modified: a.modified, section: area.title[loc] },
      };
      writeOut(file, assemble(file, parts, loc, seo, T.articleMain(loc, a, related.slice(0, 3))));
      sitemap.set(key, a.modified);
    }

    for (const p of landings) {
      const { file, parts } = shell(loc, p.slug, null);
      const seo = { key: p.slug, title: `${p[loc].metaTitle} | ${L[loc].brand}`, description: p[loc].description };
      writeOut(file, assemble(file, parts, loc, seo, T.landingMain(loc, p, articles)));
      sitemap.set(p.slug, CONTENT_UPDATED);
    }
  }

  // Placeholder profiles ("«Legal Counsel Name»") were noindex drafts linked
  // only from the draft articles. .htaccess sends their URLs to the team page.
  for (const loc of LOCALES) {
    for (const slug of ["managing-partner", "senior-litigator", "employment-counsel"]) {
      fs.rmSync(path.join(OUT, loc, "team", `${slug}.html`), { force: true });
    }
  }

  // Draft copies of held guides that came with the base export.
  for (const loc of LOCALES) for (const slug of onHold) fs.rmSync(path.join(OUT, loc, "insights", `${slug}.html`), { force: true });

  // 404 is served at whatever URL was requested, so its assets must be
  // root-absolute: "./assets/..." breaks at /ar/some/missing/page.
  {
    const file = "404.html";
    const html = readBase(file);
    const loc = /<html lang="en"/.test(html) ? "en" : "ar";
    const parts = split(html, file);
    // The export also pointed its language switch at a non-existent /en/static-404.
    const absolute = (s) =>
      s.replace(/(["\s,])\.\/(assets|images|logo-lockup|favicon)/g, "$1/$2").replace(/href="\/(ar|en)\/static-404"/g, 'href="/$1"');
    writeOut(
      file,
      absolute(parts.pre + parts.head + parts.mid.replace(ORG_SCRIPT, () => jsonLd(T.orgGraph(loc))) + parts.main + patchFooter(parts.post, loc))
    );
  }

  let htaccess = readBase(".htaccess").replace(
    /# Generated by `npm run build:static`[^\n]*\n# Edit the template[^\n]*\n/,
    "# Generated by seo-build/build.mjs from seo-build/base/.htaccess.\n# Edit those, not this copy: it is overwritten on every build.\n"
  );
  htaccess = insertBefore(
    htaccess,
    "  # --- 3. One URL per page",
    "  # --- 2b. Placeholder profiles removed by the SEO build -> team page -------\n" +
      "  RewriteRule ^(ar|en)/team/(?:managing-partner|senior-litigator|employment-counsel)(?:\\.html)?$ /$1/team [R=301,L]\n\n",
    ".htaccess redirects"
  );
  htaccess = insertBefore(
    htaccess,
    '  <FilesMatch "\\.(jpe?g|png|webp|avif|svg|ico)$">',
    '  # Crawl files change with every upload.\n  <FilesMatch "\\.(xml|txt)$">\n    Header set Cache-Control "public, max-age=3600"\n  </FilesMatch>\n\n',
    ".htaccess caching"
  );
  writeOut(".htaccess", htaccess);

  writeOut("robots.txt", robotsTxt());
  writeOut("sitemap.xml", sitemapXml());
  writeOut("llms.txt", llmsTxt(landings, articles));

  const keyFile = path.join(ROOT, "indexnow-key.txt");
  if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, `${crypto.randomBytes(16).toString("hex")}\n`);
  const indexNowKey = fs.readFileSync(keyFile, "utf8").trim();
  writeOut(`${indexNowKey}.txt`, indexNowKey);

  // No loading screen: it held every first-time visitor (everyone arriving from
  // Google) for ~2 s. main.js skips its preloader code when the element is
  // absent; js-reveal stays for the scroll animations.
  const PRELOADER = /<div class="preloader"[\s\S]*?<p class="preloader-count"[^>]*>[^<]*<\/p><\/div><\/div>/;
  const HEAD_SCRIPT = /<script>\(function\(d\)\{d\.classList\.add\('js-reveal'\);[\s\S]*?<\/script>/;
  // The founder writes his name as one word, with no gap after the honorific.
  const founderName = (s) => s.replace(/أ\/\s*عبد\s*الله/g, "أ/عبدالله").replace(/عبد الله/g, "عبدالله");

  const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const next = founderName(html)
      .replace(/style\.css\?v=\w+/g, `style.css?v=${cssVersion}`)
      .replace(/© 20\d\d/g, "© 2025") // copyright year the firm asked for
      .replace(PRELOADER, "")
      .replace(HEAD_SCRIPT, "<script>document.documentElement.classList.add('js-reveal')</script>");
    if (next !== html) fs.writeFileSync(file, next);
  }

  // site-data.js feeds the assistant, so it carries the name too.
  const dataFile = path.join(OUT, "assets", "js", "site-data.js");
  const data = fs.readFileSync(dataFile, "utf8");
  if (founderName(data) !== data) fs.writeFileSync(dataFile, founderName(data));

  const words = articles.reduce((n, a) => n + a.words.ar + a.words.en, 0);
  console.log(`\n✔ Built ${htmlFiles.length} HTML pages into ${OUT}`);
  console.log(
    `  ${articles.length} guides published in 2 languages (${words.toLocaleString("en")} words), ${onHold.size} held for legal review · ${practices.length}/${PRACTICE.length} practice pages · ${landings.length}/${LANDING.length} landing pages`
  );
  console.log(`  sitemap.xml (${sitemap.size * 2} URLs) · robots.txt · llms.txt · ${indexNowKey}.txt`);
  if (DRAFT && errors.length) console.log(`  ⚠ draft build: ${errors.length} content error(s); the items concerned were left out`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
