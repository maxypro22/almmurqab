/**
 * Small HTML helpers: escaping, JSON-LD, and a strict inspector for the
 * content fragments the writers supply. The inspector is the safety net that
 * keeps unexpected markup (and broken internal links) out of the live site.
 */

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function stripTags(html) {
  return String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(html) {
  const text = stripTags(html);
  return text ? text.split(" ").length : 0;
}

/** `<` is escaped so a string in the data can never close the script tag. */
export function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NUM = /^\d+$/;

const ALLOWED = {
  p: { class: /^callout-title$/ },
  strong: {},
  em: {},
  b: {},
  i: {},
  br: {},
  a: { href: /./, rel: /^[a-z ]+$/, target: /^_blank$/, title: /./ },
  h2: { id: ID },
  h3: { id: ID },
  ul: {},
  ol: {},
  li: {},
  dl: { class: /^key-facts$/ },
  dt: {},
  dd: {},
  div: { class: /^table-wrap$/ },
  aside: { class: /^callout callout-(key|note|warning)$/ },
  table: {},
  thead: {},
  tbody: {},
  tr: {},
  th: { scope: /^(col|row)$/, colspan: NUM, rowspan: NUM },
  td: { colspan: NUM, rowspan: NUM },
};

const VOID = new Set(["br"]);
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z-]+(?:="[^"]*")?)*)\s*\/?>/g;

/**
 * Checks a content fragment against the allow-list.
 * Returns the problems found, every link href, and the h2 headings in order.
 */
export function inspectFragment(html, { allowH2 = true } = {}) {
  const errors = [];
  const links = [];
  const headings = [];
  const stack = [];
  const source = String(html ?? "");

  for (const match of source.matchAll(TAG)) {
    const [, closing, rawName, attrText] = match;
    const name = rawName.toLowerCase();
    const rule = ALLOWED[name];
    if (!rule) {
      errors.push(`<${name}> is not allowed`);
      continue;
    }
    if (name === "h2" && !allowH2) errors.push("<h2> is not allowed here (the section heading comes from the h2 field)");

    if (closing) {
      const open = stack.pop();
      if (open !== name) errors.push(`</${name}> closes <${open ?? "nothing"}>`);
      continue;
    }

    const attrs = {};
    for (const [, key, value = ""] of attrText.matchAll(/([a-zA-Z-]+)(?:="([^"]*)")?/g)) {
      const k = key.toLowerCase();
      if (!rule[k]) errors.push(`attribute "${k}" is not allowed on <${name}>`);
      else if (!rule[k].test(value)) errors.push(`invalid ${k}="${value}" on <${name}>`);
      attrs[k] = value;
    }

    if (name === "a") links.push(attrs.href ?? "");
    if (name === "h2") {
      if (!attrs.id) errors.push("<h2> without an id");
      headings.push(attrs.id);
    }
    if (!VOID.has(name)) stack.push(name);
  }

  if (stack.length) errors.push(`unclosed: ${stack.map((t) => `<${t}>`).join(" ")}`);
  if (source.replace(TAG, "").includes("<")) errors.push('a bare "<" in text (write &lt;)');

  const seen = new Set();
  for (const id of headings) {
    if (id && seen.has(id)) errors.push(`duplicate h2 id "${id}"`);
    seen.add(id);
  }

  return { errors, links, headings };
}

/** h2 ids and their text, for tables of contents. */
export function headingsOf(html) {
  return [...String(html).matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(([, id, text]) => ({
    id,
    text: stripTags(text),
  }));
}
