# Al Murqab Law — SEO, AEO & GEO playbook

What was built into the site, and what you must do outside it to reach page 1 in Qatar.

## 1. The honest picture

- The site is now technically ahead of every competitor audited: fastest load, full structured data, 24 bilingual legal guides, dedicated pages for each target keyword. Competitors run WordPress with no schema and a handful of articles.
- **That alone does not guarantee position 1.** For searches like «محامي قطر» / "lawyer in Qatar", Google shows the **Map Pack** (Google Business Profile results) above normal results. Those rankings depend on your Business Profile, reviews and distance, not the website. For organic results, authority (links from other sites, brand searches) matters as much as content.
- Realistic timeline: new guides begin ranking for long-tail questions in 4–12 weeks; competitive head terms take 3–9 months of the work below.

## 2. Keyword → page map (do not create competing pages)

| Search term (AR / EN) | Page that targets it |
| --- | --- |
| محامي قطر · محامي في قطر · محامي · محامي قطري / lawyer in Qatar, Qatari lawyer | Home `/ar`, `/en` + guide `how-to-choose-a-lawyer-qatar` |
| استشارات قانونية في قطر · استشارة محامي / legal consultation Qatar | `/ar/legal-consultation` |
| استشارات شركات في قطر · مستشار قانوني للشركات / corporate legal services Qatar | `/ar/corporate-legal-consultancy` |
| محامي شركات في قطر · تأسيس شركة / corporate lawyer Qatar | `/ar/practice-areas/corporate` + `company-formation-qatar` |
| قانون قطر · القانون القطري · القوانين القطرية / Qatar law | `/ar/qatar-law` |
| محامي قضايا عمالية · مكافأة نهاية الخدمة / labour lawyer Qatar | `/practice-areas/labor` + 5 labour guides |
| محامي أحوال شخصية · محامي طلاق / family lawyer, divorce lawyer Qatar | `/practice-areas/family` + 4 family guides |
| محامي جنائي · شيك بدون رصيد / criminal lawyer, bounced cheque | `/practice-areas/criminal` + guides |
| محامي عقارات · لجنة المنازعات الإيجارية / real estate lawyer, rental dispute | `/practice-areas/real-estate` + guides |
| محامي تحكيم / arbitration lawyer Qatar | `/practice-areas/arbitration` + `arbitration-qatar` |

## 3. Launch checklist (week 1)

1. **Lawyer review.** Have the firm's lawyer read every guide against `REVIEW-CHECKLIST.md` before upload. These are legal (YMYL) pages: one wrong figure costs trust with Google and clients.
2. `cd seo-build && node build.mjs`, then upload the **contents** of `hostinger-site/` to `public_html` (see the Hostinger guide).
3. Test: `https://almurqablaw.com/ar`, `/en/insights/child-custody-qatar`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, one old URL such as `/about.html` (must 301).
4. **Google Search Console**: add a *Domain* property, submit `https://almurqablaw.com/sitemap.xml`, then use URL Inspection → "Request indexing" for the home pages, the 3 landing pages and the 9 practice pages (both languages).
5. **Bing Webmaster Tools**: import from Search Console, submit the sitemap, then run `node indexnow.mjs`. Bing feeds ChatGPT search and Microsoft Copilot.
6. Check with Google's Rich Results Test and the Schema Markup Validator on one article, one practice page and the home page.
7. Add analytics: GA4 (or Plausible), with conversion events on `tel:`, `wa.me` and `mailto:` clicks. The site currently has none, so you cannot measure what brings clients. Send me the measurement ID and I will add it to the build.

## 4. Google Business Profile — the biggest lever for «محامي قطر»

- **Name** exactly as on your signage and licence. Adding keywords ("Best Lawyer Qatar") breaks Google's rules and can get the profile suspended.
- **Primary category** "Law firm"; secondary "Lawyer", then specialities that exist in Google's list (e.g. "Corporate lawyer", "Family law attorney", "Employment attorney", "Criminal justice attorney").
- Address pin exactly on the office; hours Sun–Thu 8–5; phone +974 7190 0190; website `https://almurqablaw.com/ar?utm_source=gbp&utm_medium=organic`.
- Description in Arabic (with English version) naming Doha, your 9 practice areas and both languages.
- **Services**: add each practice area with a one-line description.
- **Photos**: office exterior (so people can find it), reception, meeting room, the team. Upload 10+ real photos, then one or two a month.
- **Posts**: weekly. Share each guide with a short summary and link (you have 24 ready).
- **Reviews**: ask every satisfied client, by WhatsApp link, right after a good outcome. Reply to every review in the reviewer's language. Never buy, incentivise or write reviews: it breaches Google policy and professional conduct rules.
- Once the profile is verified, replace the map on the contact page with the embed from your Business Profile so address and map match exactly.

## 5. Citations — same Name, Address, Phone everywhere

Create or complete listings with identical details (copy them from `llms.txt`):
Bing Places · Apple Business Connect · LinkedIn company page · Facebook page · Instagram, X, TikTok bios linking to the site · Qatar Chamber member directory (if a member) · Qatar Yellow Pages · Qatar Living business directory · international legal directories you qualify for (Legal 500, Chambers, IFLR1000 submissions).

Add every new official profile URL to `FIRM.sameAs` in `seo-build/lib/site.mjs` and rebuild. That links them to your entity for Google and AI engines.

## 6. Authority — links other sites give you

Aim for 2–4 quality Qatari links a month. Never buy links.
- **Commentary on new laws.** The guides already cover 2026 changes (rental Law No. 8/2026, labour Law No. 9/2026, property Cabinet Resolution No. 21/2026). Offer short expert comment to The Peninsula, Gulf Times, Al-Sharq, Al-Raya and Doha News when such laws are announced; they link to the source.
- **Partners**: accounting firms, PRO and company-formation agencies, real estate brokers, HR consultancies. Offer a guest guide on their site (e.g. "Labour law checklist for new employers") linking to the matching guide.
- **Talks and seminars** at Qatar Chamber, universities and business councils, which list speakers with links.
- **Embassies and expat communities** often keep lists of English-speaking lawyers; ask to be included.

## 7. AEO & GEO — being the answer in Google AI Overviews, ChatGPT, Perplexity, Gemini

Already built in:
- A direct answer box ("Key points") at the top of every guide, question-style headings, FAQs with FAQPage schema.
- Every figure tied to a named law and article, with an official source list and "last updated" date. This is exactly what AI engines prefer to cite.
- One consistent entity graph (LegalService + founder + website), `llms.txt`, and a robots.txt that explicitly welcomes AI crawlers.

What to keep doing:
- **Name the reviewer.** Once the lawyer has reviewed the guides, give their full name, bar registration, qualifications and photo for the founder/team pages. Articles authored and reviewed by a real, credentialed lawyer outrank anonymous ones, and AI engines weigh this heavily. Send me the details and I'll add `author`/`reviewedBy` to every guide.
- **Be first on legal changes.** When a law or decision changes, update the guide the same week (`updated:` date) and publish a short news-style guide. Early, precise pages become the source AI answers quote.
- **Test monthly.** Ask ChatGPT, Perplexity, Gemini and Google (AI Overview) questions such as «أفضل محامي شركات في قطر», "how is end of service calculated in Qatar", «كيف أرفع منع السفر في قطر». Record whether Al Murqab is cited, and which competitor is cited instead.
- Keep brand mentions consistent: always "Al Murqab Law Office / مكتب المرقاب للمحاماة".

## 8. Content calendar — next 20 bilingual guides

One or two a week, same format (copy a file in `content/articles/`):
1. Work visa and residence permit disputes (Law No. 21 of 2015)
2. Domestic workers' rights (Law No. 15 of 2017)
3. Changing employer / transferring jobs in Qatar
4. Wage Protection System and unpaid salaries
5. Non-compete clauses after the 2026 labour amendment
6. Shareholder disputes in a WLL
7. Closing / liquidating a company in Qatar
8. Bankruptcy and preventive composition for traders
9. Personal data protection compliance for businesses (Law No. 13 of 2016)
10. Anti-money-laundering obligations for companies
11. Construction contract disputes and the 10-year liability of contractors
12. Buying off-plan property in Qatar: buyer protections
13. Marriage registration and marriage contracts in Qatar
14. Wills and inheritance planning for expatriates
15. Arrest, detention and bail: your rights in Qatar
16. Traffic accidents: criminal and compensation claims
17. Medical malpractice claims in Qatar
18. Enforcing a foreign judgment in Qatar
19. Appealing a court judgment: deadlines and steps
20. Legal fees and engagement letters: what to expect

## 9. Decisions still open

- **Team page**: only the founder is listed. Real profiles for each lawyer (with credentials) strengthen trust and rankings.
- **Founder profile**: currently one sentence. Add biography, education, bar admission, languages and areas of focus.
- **Office photos** with descriptive file names and alt text (e.g. "Al Murqab Law Office reception, Salwa Road, Doha").

## 10. Monthly routine (about 2 hours)

1. Search Console → Performance: note clicks and positions for the keywords in section 2; find queries with high impressions but position 8–20 and improve those pages.
2. Publish 4–8 guides; share each on the Business Profile and LinkedIn.
3. Reply to reviews; ask for new ones.
4. Check "Pages" in Search Console for errors; rebuild and re-upload after content changes; run `node indexnow.mjs`.
5. Run the AI answer test (section 7) and adjust.
