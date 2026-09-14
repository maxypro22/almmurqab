# Al Murqab Law Office — almurqablaw.com

| Folder | What it is |
| --- | --- |
| `hostinger-site/` | The finished site. Upload the **contents** of this folder to `public_html` on Hostinger. |
| `seo-build/` | The source and build script that generates `hostinger-site/`. See [`seo-build/README.md`](seo-build/README.md). |

Rebuild after any content change (Node 20+):

```
cd seo-build
node build.mjs
```

Never edit `hostinger-site/` by hand — it is emptied and regenerated on every build.

SEO plan and launch checklist: [`seo-build/SEO-PLAYBOOK.ar.md`](seo-build/SEO-PLAYBOOK.ar.md) · [`seo-build/SEO-PLAYBOOK.en.md`](seo-build/SEO-PLAYBOOK.en.md)
