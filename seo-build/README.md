# Al Murqab Law — SEO build

Turns the static site export into the SEO-optimised site you upload to Hostinger.

```
seo-build/
  base/                 the original static export — the build reads it, never changes it
  content/
    articles/<slug>.mjs guides (Arabic + English), published at /ar|en/insights/<slug>
    practice/<slug>.mjs full copy for the nine practice-area pages
    landing/<slug>.mjs  keyword landing pages (/legal-consultation, /corporate-legal-consultancy, /qatar-law)
    home.mjs            home-page H1, sections and FAQ; about-page section
  lib/site.mjs          firm facts (phone, address…), page titles and descriptions, labels
  lib/templates.mjs     page layouts
  static/extra.css      styles appended to style.css
  build.mjs             the build
  indexnow.mjs          pings Bing/IndexNow after an upload
../hostinger-site/      OUTPUT — upload the contents of this folder to public_html
```

## Commands

Run these from this folder (needs Node 20+):

| Command | What it does |
| --- | --- |
| `node build.mjs` | Checks every content file, then rebuilds `../hostinger-site`. If anything fails a check it writes nothing. |
| `node build.mjs --draft` | Builds anyway, leaving out the files that fail. For previewing only. |
| `node indexnow.mjs` | Run **after** uploading. Tells Bing (which feeds ChatGPT search and Copilot) about every URL. |

`../hostinger-site` is emptied and rebuilt on every run. **Never edit files there by hand.** Change `content/`, `lib/site.mjs` or `base/` and rebuild.

## Adding a guide

1. Copy any file in `content/articles/` to `content/articles/<new-slug>.mjs` (lowercase, hyphens).
2. Set `slug` to the same name, choose `practiceArea`, set `published` to today.
3. Write both `ar` and `en`. The build checks lengths, allowed HTML, and that every internal link exists.
4. `node build.mjs`, check the page locally, upload, then `node indexnow.mjs`.

Each guide has a `status`:

- `"published"`: built, listed and linked.
- `"review"`: checked but **not published**. The comment beside it says what the lawyer must confirm. Links to it from other pages show as plain text until it is published.

After the lawyer has confirmed a held guide, change its status to `"published"` and rebuild. Guides with open legal points are listed in `REVIEW-CHECKLIST.md`.

When you revise a guide, set `updated: "YYYY-MM-DD"`. The date appears on the page, in the schema and in the sitemap.

## What the build does to every page

- A unique `<title>` and meta description, a canonical URL, and hreflang tags for ar, en and x-default. Correct Open Graph and Twitter tags (the practice pages used to share the home page's).
- One linked JSON-LD graph (`LegalService`, `WebSite`, founder `Person`). On top of that, per page: `Article`, `Service`, `FAQPage`, `BreadcrumbList`, `CollectionPage`, `AboutPage`, `ContactPage` or `ProfilePage`.
- Font preloads cut to the three files each language actually uses. `fetchpriority="high"` on the hero image. A CSS cache-busting version.
- Footer links to all nine practice areas and the three landing pages.
- Generates `sitemap.xml` (every page in both languages with alternates), `robots.txt` (AI crawlers explicitly allowed), `llms.txt`, and the IndexNow key file.
- Deletes the placeholder team profiles. `.htaccess` 301-redirects their URLs to the team page.
- Uses root-absolute asset paths on the 404 page, so it keeps its styling at any URL depth.
