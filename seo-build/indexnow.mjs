/**
 * Tells Bing, Yandex, Seznam and Naver (via IndexNow) that every URL in the
 * sitemap is new or updated. Bing's index also feeds ChatGPT search and
 * Copilot, so this is the fastest way into those answers.
 *
 * Run it AFTER uploading: the key file must already be live at
 * https://almurqablaw.com/<key>.txt or the request is rejected.
 *
 *   node indexnow.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = "almurqablaw.com";

const key = fs.readFileSync(path.join(ROOT, "indexnow-key.txt"), "utf8").trim();
const sitemap = fs.readFileSync(path.resolve(ROOT, "..", "hostinger-site", "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const live = await fetch(`https://${HOST}/${key}.txt`).catch(() => null);
if (!live?.ok || (await live.text()).trim() !== key) {
  console.error(`✖ https://${HOST}/${key}.txt is not live yet. Upload hostinger-site first, then run this again.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});

console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (!res.ok) console.log(await res.text());
