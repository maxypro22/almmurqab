/**
 * Makes a copy of ../hostinger-site that works on GitHub Pages, for previewing.
 *
 *   node preview.mjs <base-path> <out-dir>     e.g. node preview.mjs /almmurqab ../_preview
 *
 * GitHub Pages serves the site under /<repo>/ and has no .htaccess, so every
 * root-absolute link is prefixed with the base path and clean URLs get their
 * .html back (/ar/about -> /almmurqab/ar/about.html). Every page is marked
 * noindex so the preview never competes with almurqablaw.com in search.
 * Absolute https://almurqablaw.com URLs (canonical, hreflang, schema) are left alone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "../hostinger-site");
const BASE = (process.argv[2] || "").replace(/\/+$/, "");
const OUT = path.resolve(process.argv[3] || path.resolve(HERE, "../_preview"));

if (!BASE.startsWith("/")) {
  console.error("Usage: node preview.mjs /<repo-name> <out-dir>");
  process.exit(1);
}
if (OUT === SRC) {
  console.error("Output folder must not be hostinger-site.");
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });
fs.rmSync(path.join(OUT, ".htaccess"), { force: true });
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

const missing = new Set();

function mapUrl(url) {
  const [, pathname, rest] = url.match(/^([^?#]*)(.*)$/);
  let target;
  let file;
  if (pathname === "/") {
    target = "/";
    file = "index.html";
  } else if (path.posix.extname(pathname)) {
    target = pathname;
    file = pathname.slice(1);
  } else {
    target = pathname.replace(/\/+$/, "") + ".html";
    file = target.slice(1);
  }
  if (!fs.existsSync(path.join(OUT, decodeURIComponent(file)))) missing.add(pathname);
  return BASE + target + rest;
}

const rootUrl = /^\/(?!\/)/;

function rewrite(html) {
  return html
    .replace(/\b(href|src|action|poster)="([^"]*)"/g, (m, attr, url) =>
      rootUrl.test(url) ? `${attr}="${mapUrl(url)}"` : m,
    )
    .replace(/\b(srcset|imagesrcset)="([^"]*)"/g, (m, attr, list) =>
      `${attr}="${list
        .split(",")
        .map((part) => part.replace(/^(\s*)(\S+)/, (s, sp, url) => (rootUrl.test(url) ? sp + mapUrl(url) : s)))
        .join(",")}"`,
    )
    .replace(/url\((['"]?)(\/(?!\/)[^'")]*)\1\)/g, (m, q, url) => `url(${q}${mapUrl(url)}${q})`);
}

const NOINDEX = '<meta name="robots" content="noindex, nofollow">';
let pages = 0;

for (const rel of fs.readdirSync(OUT, { recursive: true })) {
  const file = path.join(OUT, rel);
  if (!fs.statSync(file).isFile()) continue;
  if (file.endsWith(".html")) {
    let html = rewrite(fs.readFileSync(file, "utf8"));
    html = /<meta name="robots"[^>]*>/.test(html)
      ? html.replace(/<meta name="robots"[^>]*>/g, NOINDEX)
      : html.replace(/<head>/, `<head>${NOINDEX}`);
    fs.writeFileSync(file, html);
    pages++;
  } else if (file.endsWith(".css")) {
    fs.writeFileSync(file, rewrite(fs.readFileSync(file, "utf8")));
  }
}

fs.writeFileSync(path.join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");

console.log(`Preview: ${pages} pages -> ${OUT} (base ${BASE})`);
if (missing.size) {
  console.error(`Links to missing files:\n  ${[...missing].join("\n  ")}`);
  process.exit(1);
}
