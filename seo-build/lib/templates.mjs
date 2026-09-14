/**
 * Page templates for the SEO build.
 *
 * Markup mirrors the site's existing components — the same compiled Tailwind
 * utilities — plus the handful of classes in static/extra.css. Only classes
 * that exist in style.css may be used here: the stylesheet is not rebuilt.
 */
import { SITE, CONTENT_UPDATED, FIRM, PRACTICE, LANDING, PAGES, L, practiceBySlug, CATEGORY_ORDER } from "./site.mjs";
import { esc, jsonLd, headingsOf } from "./html.mjs";

export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const FOUNDER_ID = `${SITE}/#founder`;

export const other = (loc) => (loc === "ar" ? "en" : "ar");
export const href = (loc, key = "") => `/${loc}${key ? `/${key}` : ""}`;
export const pageUrl = (loc, key = "") => `${SITE}${href(loc, key)}`;

const TEL = `tel:${FIRM.phoneDial}`;
const EXT = 'target="_blank" rel="noopener noreferrer"';
const pad = (n) => String(n).padStart(2, "0");

// ------------------------------------------------------------------- <head>

export function seoTags({ loc, key = "", title, description, ogType = "website", image = FIRM.image, imageAlt, article, robots }) {
  const url = pageUrl(loc, key);
  const imageUrl = `${SITE}${image}`;
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}"/>`,
    `<meta name="robots" content="${robots ?? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<link rel="alternate" hreflang="ar" href="${pageUrl("ar", key)}"/>`,
    `<link rel="alternate" hreflang="en" href="${pageUrl("en", key)}"/>`,
    `<link rel="alternate" hreflang="x-default" href="${pageUrl("ar", key)}"/>`,
    `<meta property="og:type" content="${ogType}"/>`,
    `<meta property="og:site_name" content="${esc(FIRM.name[loc])}"/>`,
    `<meta property="og:locale" content="${loc}_QA"/>`,
    `<meta property="og:locale:alternate" content="${other(loc)}_QA"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:title" content="${esc(title)}"/>`,
    `<meta property="og:description" content="${esc(description)}"/>`,
    `<meta property="og:image" content="${imageUrl}"/>`,
  ];
  if (image === FIRM.image) {
    tags.push(`<meta property="og:image:width" content="1024"/>`, `<meta property="og:image:height" content="1024"/>`);
  }
  tags.push(`<meta property="og:image:alt" content="${esc(imageAlt ?? FIRM.name[loc])}"/>`);
  if (article) {
    tags.push(
      `<meta property="article:published_time" content="${article.published}"/>`,
      `<meta property="article:modified_time" content="${article.modified}"/>`,
      `<meta property="article:section" content="${esc(article.section)}"/>`
    );
  }
  tags.push(
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="@almurqablaw"/>`,
    `<meta name="twitter:title" content="${esc(title)}"/>`,
    `<meta name="twitter:description" content="${esc(description)}"/>`,
    `<meta name="twitter:image" content="${imageUrl}"/>`,
    `<meta name="geo.region" content="QA-DA"/>`,
    `<meta name="geo.placename" content="${FIRM.city.en}"/>`,
    `<meta name="geo.position" content="${FIRM.lat};${FIRM.lng}"/>`,
    `<meta name="ICBM" content="${FIRM.lat}, ${FIRM.lng}"/>`,
    `<meta name="theme-color" content="#6f5330"/>`
  );
  return tags.join("");
}

// ---------------------------------------------------------------- JSON-LD

/** The firm, the website and the founder as one linked graph, on every page. */
export function orgGraph(loc) {
  const alt = other(loc);
  const organization = {
    "@type": "LegalService",
    "@id": ORG_ID,
    name: FIRM.name[loc],
    alternateName: [FIRM.short[loc], FIRM.name[alt], FIRM.short[alt]],
    description: FIRM.description[loc],
    url: pageUrl(loc),
    logo: { "@type": "ImageObject", url: `${SITE}${FIRM.logo}` },
    image: `${SITE}${FIRM.image}`,
    telephone: FIRM.phoneDial,
    email: FIRM.email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: FIRM.street[loc],
      addressLocality: FIRM.city[loc],
      addressRegion: FIRM.city[loc],
      addressCountry: "QA",
    },
    geo: { "@type": "GeoCoordinates", latitude: FIRM.lat, longitude: FIRM.lng },
    hasMap: FIRM.mapUrl,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: FIRM.days, opens: FIRM.opens, closes: FIRM.closes },
    ],
    areaServed: [
      { "@type": "Country", name: FIRM.country[loc] },
      { "@type": "City", name: FIRM.city[loc] },
    ],
    availableLanguage: [
      { "@type": "Language", name: "Arabic", alternateName: "ar" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: FIRM.phoneDial,
        email: FIRM.email,
        contactType: "customer service",
        areaServed: "QA",
        availableLanguage: ["Arabic", "English"],
      },
    ],
    founder: { "@id": FOUNDER_ID },
    sameAs: FIRM.sameAs,
    knowsAbout: [...PRACTICE.map((p) => p.title[loc]), loc === "ar" ? "القانون القطري" : "Qatari law"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: loc === "ar" ? "الخدمات القانونية" : "Legal Services",
      itemListElement: PRACTICE.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: p.title[loc],
          description: p.summary[loc],
          url: pageUrl(loc, `practice-areas/${p.slug}`),
        },
      })),
    },
  };
  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE}/`,
    name: FIRM.name.en,
    alternateName: FIRM.name.ar,
    inLanguage: ["ar", "en"],
    publisher: { "@id": ORG_ID },
  };
  const founder = {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FIRM.founder.name[loc],
    jobTitle: FIRM.founder.role[loc],
    worksFor: { "@id": ORG_ID },
    url: pageUrl(loc, `team/${FIRM.founder.slug}`),
    image: `${SITE}${FIRM.founder.image}`,
  };
  return { "@context": "https://schema.org", "@graph": [organization, website, founder] };
}

export const faqLd = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

// ------------------------------------------------------------ Components

export function breadcrumb(loc, trail) {
  const items = trail
    .map((t, i) => {
      const last = i === trail.length - 1;
      const inner = last
        ? `<span class="text-ink-muted" aria-current="page">${esc(t.name)}</span>`
        : `<a class="transition-colors hover:text-ink" href="${href(loc, t.key)}">${esc(t.name)}</a>`;
      return i === 0 ? `<li>${inner}</li>` : `<li class="flex items-center gap-2"><span aria-hidden="true" class="text-brand">/</span>${inner}</li>`;
    })
    .join("");
  return {
    html: `<nav aria-label="${esc(L[loc].breadcrumb)}"><ol class="flex flex-wrap items-center gap-2 text-xs text-ink-faint">${items}</ol></nav>`,
    ld: jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: pageUrl(loc, t.key) })),
    }),
  };
}

/** Writers' fragments: heading classes added, external links opened safely. */
export function renderBody(html) {
  return String(html)
    .replace(/<h2 id="([^"]+)">/g, '<h2 id="$1" class="display">')
    .replace(/<h3( id="[^"]+")?>/g, '<h3$1 class="display">')
    .replace(/<a\s+([^>]*)>/g, (tag, attrs) => {
      const url = attrs.match(/href="([^"]*)"/)?.[1] ?? "";
      return /^https?:\/\//.test(url) ? `<a href="${url}" ${EXT}>` : `<a href="${url}">`;
    });
}

export function contactButtons(loc, spacing = "") {
  return `<div class="${spacing} flex flex-wrap gap-3"><a href="${TEL}" class="btn btn-solid">${L[loc].call}</a><a href="${FIRM.whatsapp}" ${EXT} class="btn btn-ghost">${L[loc].whatsapp}</a><a class="btn btn-ghost" href="${href(loc, "contact")}">${L[loc].book}</a></div>`;
}

function pageHero(loc, { bc, eyebrow, h1, lede, actions = false }) {
  return (
    `<section class="border-b border-line bg-paper-warm"><div class="shell pt-16 pb-14 md:pt-24 md:pb-20">${bc.html}` +
    (eyebrow ? `<p class="eyebrow mt-10">${esc(eyebrow)}</p>` : "") +
    `<h1 class="display ${eyebrow ? "mt-5" : "mt-10"} text-4xl md:text-6xl">${esc(h1)}</h1>` +
    (lede ? `<p class="lede mt-8 max-w-2xl">${esc(lede)}</p>` : "") +
    (actions ? contactButtons(loc, "mt-10") : "") +
    `</div></section>`
  );
}

export function ctaBand(loc, title = L[loc].ctaTitle, text = L[loc].ctaText) {
  return `<section class="bg-slate text-paper"><div class="shell py-20 text-center md:py-28"><h2 class="display mx-auto max-w-2xl text-3xl md:text-5xl" data-reveal="up">${esc(title)}</h2><p class="mx-auto mt-7 max-w-xl text-sm leading-loose text-on-slate" data-reveal="up" style="transition-delay:110ms">${esc(text)}</p><div class="mt-11 flex flex-wrap justify-center gap-4" data-reveal="up" style="transition-delay:220ms"><a href="${TEL}" class="btn bg-paper text-ink hover:bg-brand">${FIRM.phoneDisplay[loc]}</a><a href="${FIRM.whatsapp}" ${EXT} class="btn btn-onDark">${L[loc].whatsapp}</a><a class="btn btn-onDark" href="${href(loc, "contact")}">${L[loc].book}</a></div></div></section>`;
}

function ctaBox(loc) {
  return `<div class="cta-box"><p class="display text-lg leading-snug">${esc(L[loc].askTitle)}</p><p class="mt-3 text-sm leading-relaxed text-ink-muted">${esc(L[loc].askText)}</p><div class="mt-5 flex flex-wrap gap-3"><a href="${TEL}" class="btn btn-solid btn-compact">${L[loc].call}</a><a href="${FIRM.whatsapp}" ${EXT} class="btn btn-ghost btn-compact">${L[loc].whatsapp}</a></div></div>`;
}

function tocNav(items, label) {
  if (!items.length) return "";
  return `<nav class="lg:sticky lg:top-28" aria-label="${esc(label)}"><p class="eyebrow">${esc(label)}</p><ol class="mt-4 space-y-2.5 text-sm">${items
    .map((h) => `<li><a href="#${h.id}" class="link-underline text-ink-muted hover:text-ink">${esc(h.text)}</a></li>`)
    .join("")}</ol></nav>`;
}

function sourcesBlock(loc, sources) {
  if (!sources?.length) return "";
  return `<section class="mt-14 border-t border-line pt-8"><p class="eyebrow">${L[loc].sources}</p><ol class="source-list mt-5 space-y-3 text-sm">${sources
    .map((s) => `<li><a href="${esc(s.url)}" ${EXT} class="text-ink-muted underline transition-colors hover:text-ink">${esc(s.label)} ↗</a></li>`)
    .join("")}</ol></section>`;
}

export function faqList(faqs) {
  return `<div class="faq mt-10 divide-y divide-line border-y border-line">${faqs
    .map(
      (f) =>
        `<details class="group py-6"><summary class="flex cursor-pointer list-none items-start justify-between gap-6"><h3 class="display text-lg leading-snug md:text-xl">${esc(f.q)}</h3><span aria-hidden="true" class="mt-1 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45">+</span></summary><p class="mt-4 max-w-3xl text-sm leading-loose text-ink-muted">${esc(f.a)}</p></details>`
    )
    .join("")}</div>`;
}

export function faqSection(loc, faqs, title = L[loc].faqTitle) {
  return `<section class="border-t border-line bg-paper-warm"><div class="shell py-20 md:py-24"><h2 class="display text-3xl md:text-4xl">${esc(title)}</h2><div class="rule-short mt-6"></div>${faqList(faqs)}</div></section>`;
}

export function articleCard(loc, a) {
  const area = practiceBySlug[a.practiceArea];
  return `<article class="area-card group flex flex-col"><div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-wide text-ink-faint"><span class="text-ink-muted">${esc(area.title[loc])}</span><span aria-hidden="true">·</span><time datetime="${a.modified}" dir="ltr">${a.modified}</time><span aria-hidden="true">·</span><span>${a.minutes[loc]} ${L[loc].minRead}</span></div><h3 class="display mt-5 text-xl leading-snug"><a class="after:absolute after:inset-0" href="${href(loc, `insights/${a.slug}`)}">${esc(a[loc].title)}</a></h3><p class="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">${esc(a[loc].description)}</p><span class="mt-6 inline-block text-xs tracking-[0.14em] text-ink-faint transition-colors group-hover:text-ink">${L[loc].readMore}</span></article>`;
}

export function featureCards(loc, cards, spacing = "mt-14") {
  return `<div class="cell-grid ${spacing} md:grid-cols-3">${cards
    .map(
      (c, i) =>
        `<a class="area-card group flex flex-col" data-reveal="up" style="transition-delay:${i * 110}ms" href="${href(loc, c.key)}"><span class="num" dir="ltr">${pad(i + 1)}</span><h3 class="display mt-5 text-xl">${esc(c.title)}</h3><p class="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">${esc(c.text)}</p><span class="mt-6 inline-block text-xs tracking-[0.14em] text-ink-faint transition-colors group-hover:text-ink">${L[loc].readMore}</span></a>`
    )
    .join("")}</div>`;
}

function practiceTiles(loc, list, columns, withSummary = false) {
  return `<div class="cell-grid mt-8 ${columns}">${list
    .map(
      (p) =>
        `<a class="group bg-paper-warm p-6 transition-colors hover:bg-paper" href="${href(loc, `practice-areas/${p.slug}`)}"><span class="display text-xs text-brand" dir="ltr">${p.num}</span><p class="display mt-3 text-lg">${esc(p.title[loc])}</p>${
          withSummary ? `<p class="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">${esc(p.summary[loc])}</p>` : ""
        }</a>`
    )
    .join("")}</div>`;
}

function groupByArea(articles) {
  return CATEGORY_ORDER.map((slug) => ({ area: practiceBySlug[slug], items: articles.filter((a) => a.practiceArea === slug) })).filter(
    (g) => g.items.length
  );
}

// ------------------------------------------------------------ Home / about

export function homeSections(loc, H, featured) {
  const help =
    `<section class="section border-t border-line bg-paper-warm"><div class="shell"><div class="grid gap-14 md:grid-cols-12 md:gap-16">` +
    `<div class="md:col-span-5" data-reveal="side"><p class="eyebrow">${esc(H.help.eyebrow)}</p><h2 class="display mt-5 text-3xl leading-snug md:text-4xl">${esc(H.help.h2)}</h2><div class="rule-short mt-7"></div></div>` +
    `<div class="prose-body prose-flow md:col-span-7" data-reveal="up">${H.help.paragraphs.map((p, i) => `<p${i ? "" : ' class="lede"'}>${p}</p>`).join("")}</div>` +
    `</div>${featureCards(loc, H.help.cards)}</div></section>`;

  const guides = featured.length
    ? `<section class="section"><div class="shell"><div class="flex flex-wrap items-end justify-between gap-6" data-reveal="up"><div><p class="eyebrow">${esc(H.guides.eyebrow)}</p><h2 class="display mt-5 text-3xl md:text-5xl">${esc(H.guides.h2)}</h2></div><a class="link-underline text-sm tracking-wide text-ink-muted hover:text-ink" href="${href(loc, "insights")}">${L[loc].allInsights}</a></div><div class="cell-grid mt-14 md:grid-cols-2 lg:grid-cols-3">${featured
        .map((a) => articleCard(loc, a))
        .join("")}</div></div></section>`
    : "";

  return help + guides + faqSection(loc, H.faqs, H.faqTitle);
}

export function aboutSection(loc, A, prefix) {
  const f = FIRM.founder;
  const img = (w) => `${prefix}images/team/${f.slug}-${w}.webp`;
  return (
    `<section class="section border-t border-line"><div class="shell grid gap-14 md:grid-cols-12 md:gap-16">` +
    `<div class="md:col-span-7" data-reveal="up"><p class="eyebrow">${esc(A.eyebrow)}</p><h2 class="display mt-5 text-3xl leading-snug md:text-4xl">${esc(A.h2)}</h2><div class="rule-short mt-7"></div><div class="prose-body prose-flow mt-8"><p class="lede">${esc(A.lede)}</p>${A.html}</div></div>` +
    `<div class="md:col-span-5" data-reveal="side"><a class="area-card area-card-media group mx-auto block max-w-sm md:mx-0" href="${href(loc, `team/${f.slug}`)}"><div class="img-frame aspect-[4/5]"><img src="${img(1000)}" srcset="${img(640)} 640w, ${img(1000)} 1000w" sizes="(min-width: 768px) 384px, 100vw" alt="${esc(f.display[loc])}" width="1000" height="1043" loading="lazy" decoding="async" class="media-img absolute inset-0 h-full w-full object-cover object-top"/></div><div class="area-card-body"><p class="eyebrow">${esc(f.role[loc])}</p><h3 class="display mt-3 text-xl">${esc(f.display[loc])}</h3><span class="mt-5 inline-block text-xs tracking-[0.14em] text-ink-faint transition-colors group-hover:text-ink">${esc(A.founderLink)}</span></div></a></div>` +
    `</div></section>`
  );
}

export function practiceIndexSection(loc, H) {
  return `<section class="border-t border-line bg-paper-warm"><div class="shell py-16 md:py-20"><p class="eyebrow">${esc(H.practiceIndex.eyebrow)}</p>${featureCards(loc, H.help.cards, "mt-8")}</div></section>`;
}

// ---------------------------------------------------------------- Guides

export function insightsMain(loc, articles) {
  const P = PAGES.insights[loc];
  const key = "insights";
  const url = pageUrl(loc, key);
  const bc = breadcrumb(loc, [
    { name: L[loc].home, key: "" },
    { name: L[loc].insights, key },
  ]);
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    name: P.h1,
    description: P.description,
    url,
    inLanguage: loc,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: pageUrl(loc, `insights/${a.slug}`),
        name: a[loc].title,
      })),
    },
  };
  const hub =
    loc === "ar"
      ? `تبحث عن نظرة شاملة على النظام القانوني؟ ابدأ من <a href="${href(loc, "qatar-law")}">دليل القانون القطري</a>.`
      : `Looking for the bigger picture? Start with our <a href="${href(loc, "qatar-law")}">guide to Qatari law</a>.`;
  const groups = groupByArea(articles);
  const list = groups.length
    ? groups
        .map(
          (g, i) =>
            `<div class="${i ? "mt-16" : "mt-14"}"><div class="flex flex-wrap items-end justify-between gap-6"><h2 class="display text-2xl md:text-3xl">${esc(g.area.title[loc])}</h2><a class="link-underline text-xs tracking-[0.14em] text-ink-muted hover:text-ink" href="${href(loc, `practice-areas/${g.area.slug}`)}">${L[loc].viewArea}</a></div><div class="cell-grid mt-8 md:grid-cols-2 lg:grid-cols-3">${g.items
              .map((a) => articleCard(loc, a))
              .join("")}</div></div>`
        )
        .join("")
    : `<p class="mt-14 text-sm text-ink-muted">${L[loc].noArticles}</p>`;

  return `<main id="main">${jsonLd(ld)}${bc.ld}${pageHero(loc, { bc, eyebrow: P.eyebrow, h1: P.h1, lede: P.lede })}<section class="section"><div class="shell"><p class="prose-body max-w-2xl border-s-2 border-brand ps-6 text-sm leading-loose text-ink-muted">${hub}</p>${list}</div></section>${ctaBand(loc)}</main>`;
}

export function articleMain(loc, a, related) {
  const c = a[loc];
  const area = practiceBySlug[a.practiceArea];
  const key = `insights/${a.slug}`;
  const url = pageUrl(loc, key);
  const bc = breadcrumb(loc, [
    { name: L[loc].home, key: "" },
    { name: L[loc].insights, key: "insights" },
    { name: c.title, key },
  ]);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: c.title,
    description: c.description,
    abstract: c.lede,
    inLanguage: loc,
    datePublished: a.published,
    dateModified: a.modified,
    author: { "@type": "Organization", "@id": ORG_ID, name: FIRM.name[loc], url: pageUrl(loc) },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": WEBSITE_ID },
    image: `${SITE}${area.image.jpg}`,
    articleSection: area.title[loc],
    about: { "@type": "Thing", name: L[loc].inQatar(area.title[loc]) },
    wordCount: a.words[loc],
    citation: (a.sources ?? []).map((s) => s.url),
  };
  const row = (label, value, time = true) =>
    `<div class="flex justify-between gap-4"><dt class="text-ink-faint">${label}</dt><dd dir="ltr">${time ? `<time datetime="${value}">${value}</time>` : value}</dd></div>`;

  const content =
    `<div class="lg:col-span-8">` +
    `<div class="quick-answer"><p class="quick-answer-title">${L[loc].keyPoints}</p><ul>${c.takeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` +
    `<div class="article-body mt-12">${renderBody(c.body)}</div>` +
    `<section class="mt-16 border-t border-line pt-12"><h2 class="display text-2xl md:text-3xl">${L[loc].faqTitle}</h2>${faqList(c.faqs)}</section>` +
    sourcesBlock(loc, a.sources) +
    `<p class="mt-10 border-s-2 border-brand ps-5 text-[13px] leading-loose text-ink-faint">${esc(L[loc].disclaimer)}</p>` +
    `</div>`;

  const aside =
    `<aside class="lg:col-span-4"><div class="h-full space-y-9">` +
    `<div><p class="eyebrow">${L[loc].preparedBy}</p><a class="group mt-4 inline-flex items-center gap-3" href="${href(loc, "about")}"><span aria-hidden="true" class="display flex h-10 w-10 shrink-0 items-center justify-center border border-brand bg-paper text-xs text-ink-faint">${loc === "ar" ? "م" : "AM"}</span><span><span class="block text-sm transition-colors group-hover:text-ink">${esc(L[loc].author)}</span><span class="block text-xs text-ink-faint">${esc(L[loc].authorRole)}</span></span></a></div>` +
    `<dl class="space-y-4 border-y border-line py-6 text-xs">${row(L[loc].published, a.published)}${row(L[loc].updated, a.modified)}${row(L[loc].minRead, a.minutes[loc], false)}</dl>` +
    `<div><p class="eyebrow">${L[loc].practiceArea}</p><a class="link-underline mt-3 inline-block text-sm" href="${href(loc, `practice-areas/${area.slug}`)}">${esc(area.title[loc])} →</a></div>` +
    ctaBox(loc) +
    tocNav(headingsOf(c.body), L[loc].toc) +
    `</div></aside>`;

  const relatedSection = related.length
    ? `<section class="border-t border-line bg-paper-warm"><div class="shell py-16 md:py-20"><p class="eyebrow">${L[loc].related}</p><div class="cell-grid mt-8 md:grid-cols-2 lg:grid-cols-3">${related
        .map((r) => articleCard(loc, r))
        .join("")}</div></div></section>`
    : "";

  return `<main id="main">${jsonLd(ld)}${bc.ld}${jsonLd(faqLd(c.faqs))}${pageHero(loc, {
    bc,
    eyebrow: area.title[loc],
    h1: c.title,
    lede: c.lede,
  })}<section class="section"><div class="shell grid gap-14 lg:grid-cols-12 lg:gap-16">${content}${aside}</div></section>${relatedSection}${ctaBand(loc)}</main>`;
}

// --------------------------------------------------------- Practice areas

export function practiceMain(loc, c, related, prefix) {
  const t = c[loc];
  const area = practiceBySlug[c.slug];
  const key = `practice-areas/${area.slug}`;
  const url = pageUrl(loc, key);
  const bc = breadcrumb(loc, [
    { name: L[loc].home, key: "" },
    { name: L[loc].practiceAreas, key: "practice-areas" },
    { name: area.title[loc], key },
  ]);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: t.h1,
    serviceType: area.title[loc],
    description: t.lede,
    url,
    inLanguage: loc,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: FIRM.country[loc] },
    availableLanguage: ["ar", "en"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: area.title[loc],
      itemListElement: t.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
    },
  };

  const srcset = area.image.srcset
    .split(", ")
    .map((s) => prefix + s)
    .join(", ");
  const image = `<div class="img-frame group relative aspect-[21/9] w-full md:aspect-[3/1]"><img alt="" aria-hidden="true" decoding="async" class="media-img object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="${prefix}${area.image.src}" srcset="${srcset}" sizes="100vw"/></div>`;

  const intro =
    `<section class="section"><div class="shell grid gap-14 md:grid-cols-12 md:gap-16">` +
    `<div class="md:col-span-5" data-reveal="side"><h2 class="display text-2xl leading-snug md:text-3xl">${esc(L[loc].inQatar(area.title[loc]))}</h2><div class="rule-short mt-6"></div><p class="mt-8 text-sm leading-loose text-ink-muted">${esc(L[loc].confidential)}</p>${contactButtons(loc, "mt-9")}</div>` +
    `<div class="prose-body prose-flow md:col-span-7" data-reveal="up">${renderBody(t.intro)}</div>` +
    `</div></section>`;

  const card = (s, i) =>
    `<span class="step-num" dir="ltr">${pad(i + 1)}</span><h3 class="display mt-4 text-lg leading-snug">${esc(s.title)}</h3><p class="mt-3 text-sm leading-relaxed text-ink-muted">${esc(s.text)}</p>`;

  const services = `<section class="border-t border-line bg-paper-warm"><div class="shell py-20 md:py-24"><h2 class="display text-3xl md:text-4xl">${esc(L[loc].services)}</h2><div class="rule-short mt-6"></div><div class="cell-grid mt-12 sm:grid-cols-2 lg:grid-cols-3">${t.services
    .map((s, i) => `<div class="service-card">${card(s, i)}</div>`)
    .join("")}</div></div></section>`;

  const process = `<section class="section"><div class="shell"><h2 class="display text-3xl md:text-4xl">${esc(L[loc].process)}</h2><div class="rule-short mt-6"></div><ol class="cell-grid steps mt-12">${t.process
    .map((s, i) => `<li>${card(s, i)}</li>`)
    .join("")}</ol></div></section>`;

  const relatedList = related.length
    ? `<div><p class="eyebrow">${L[loc].related}</p><ul class="mt-5 divide-y divide-line border-y border-line">${related
        .map(
          (r) =>
            `<li class="py-4"><a class="text-sm leading-relaxed text-ink-muted transition-colors hover:text-ink" href="${href(loc, `insights/${r.slug}`)}">${esc(r[loc].title)}</a></li>`
        )
        .join("")}</ul></div>`
    : "";

  const body =
    `<section class="border-t border-line"><div class="shell grid gap-14 py-20 md:py-24 lg:grid-cols-12 lg:gap-16">` +
    `<div class="lg:col-span-8"><div class="article-body">${renderBody(t.body)}</div>${sourcesBlock(loc, c.sources)}</div>` +
    `<aside class="lg:col-span-4"><div class="space-y-9">${relatedList}${ctaBox(loc)}</div></aside>` +
    `</div></section>`;

  const others = `<section class="border-t border-line bg-paper-warm"><div class="shell py-16 md:py-20"><p class="eyebrow">${L[loc].otherAreas}</p>${practiceTiles(
    loc,
    PRACTICE.filter((p) => p.slug !== area.slug),
    "sm:grid-cols-2 lg:grid-cols-4"
  )}</div></section>`;

  return `<main id="main">${jsonLd(ld)}${bc.ld}${jsonLd(faqLd(t.faqs))}${pageHero(loc, {
    bc,
    eyebrow: `${area.num} — ${area.title[loc]}`,
    h1: t.h1,
    lede: t.lede,
    actions: true,
  })}${image}${intro}${services}${process}${body}${faqSection(loc, t.faqs)}${others}${ctaBand(loc)}</main>`;
}

// ----------------------------------------------------------- Landing pages

export function landingMain(loc, c, articles) {
  const t = c[loc];
  const key = c.slug;
  const url = pageUrl(loc, key);
  const name = LANDING.find((l) => l.slug === key)?.title[loc] ?? t.h1;
  const bc = breadcrumb(loc, [
    { name: L[loc].home, key: "" },
    { name, key },
  ]);
  const isGuide = key === "qatar-law";
  const ld = isGuide
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#page`,
        name: t.h1,
        description: t.description,
        url,
        inLanguage: loc,
        dateModified: CONTENT_UPDATED,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        about: { "@type": "Thing", name: loc === "ar" ? "القانون القطري" : "Law of Qatar" },
        citation: (c.sources ?? []).map((s) => s.url),
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name: t.h1,
        serviceType: name,
        description: t.lede,
        url,
        inLanguage: loc,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: FIRM.country[loc] },
        availableLanguage: ["ar", "en"],
      };

  const content = `<div class="lg:col-span-8"><div class="article-body">${t.sections
    .map((s) => `<h2 id="${s.id}" class="display">${esc(s.h2)}</h2>${renderBody(s.html)}`)
    .join("")}</div>${sourcesBlock(loc, c.sources)}</div>`;
  const aside = `<aside class="lg:col-span-4"><div class="h-full space-y-9">${ctaBox(loc)}${tocNav(
    t.sections.map((s) => ({ id: s.id, text: s.h2 })),
    L[loc].onPage
  )}</div></aside>`;

  const groups = isGuide ? groupByArea(articles) : [];
  const guides = groups.length
    ? `<section class="section border-t border-line"><div class="shell"><h2 class="display text-3xl md:text-4xl">${L[loc].guidesByArea}</h2><div class="rule-short mt-6"></div><div class="mt-12 grid gap-9 md:grid-cols-2 lg:grid-cols-3">${groups
        .map(
          (g) =>
            `<div><h3 class="display text-xl"><a class="link-underline" href="${href(loc, `practice-areas/${g.area.slug}`)}">${esc(g.area.title[loc])}</a></h3><ul class="mt-4 space-y-3 text-sm leading-relaxed">${g.items
              .map((a) => `<li><a class="text-ink-muted transition-colors hover:text-ink" href="${href(loc, `insights/${a.slug}`)}">${esc(a[loc].title)}</a></li>`)
              .join("")}</ul></div>`
        )
        .join("")}</div></div></section>`
    : "";

  const areas = `<section class="border-t border-line bg-paper-warm"><div class="shell py-16 md:py-20"><p class="eyebrow">${L[loc].practiceAreas}</p>${practiceTiles(
    loc,
    PRACTICE,
    "sm:grid-cols-2 lg:grid-cols-3",
    true
  )}</div></section>`;

  return `<main id="main">${jsonLd(ld)}${bc.ld}${jsonLd(faqLd(t.faqs))}${pageHero(loc, {
    bc,
    eyebrow: t.eyebrow,
    h1: t.h1,
    lede: t.lede,
    actions: true,
  })}<section class="section"><div class="shell grid gap-14 lg:grid-cols-12 lg:gap-16">${content}${aside}</div></section>${guides}${faqSection(
    loc,
    t.faqs
  )}${areas}${ctaBand(loc, t.ctaTitle, t.ctaText)}</main>`;
}
