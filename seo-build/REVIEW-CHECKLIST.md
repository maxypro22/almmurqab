# Lawyer review checklist — before uploading

Every guide, practice page and landing page was researched against official Qatari sources (Al Meezan, the Supreme Judicial Council, ministries), and each lists the sources used. The points below are the ones the research **could not confirm from an opened official text**, or that come from recent 2025–2026 changes. The firm's lawyer should confirm or correct each one. Edit the matching file in `seo-build/content/`, then run `node build.mjs`.

Legal content is judged strictly by Google (YMYL). A named, credentialed reviewer on each guide is one of the strongest ranking signals you can add. See the playbook, section 7.

## 1. Recent legislation — confirm against the Official Gazette

| Change as reported | Used in | Source quality |
| --- | --- | --- |
| **Law No. 9 of 2026** amending the Labour Law: complaints must first go to the Ministry for settlement, limitation suspended during settlement, non-compete up to 2 years with Ministry approval, new summary-dismissal ground (inciting an unlawful strike), Article 78 (public holidays) replaced | labour guides, `practice/labor`, `landing/qatar-law` | Law-firm alerts (Clyde & Co, Crowell & Moring, K&L Gates) and Al-Sharq; text not opened. Sources disagree on complaint timings (7 + 3 days vs 20 days) and on the effective date |
| **Law No. 8 of 2026** amending Real Estate Lease Law No. 4/2008 (in force 3 Sept 2026): committee first, exclusive jurisdiction, appeal to Court of Appeal within 15 days, flat QAR 250 registration, QAR 1,000 settlement for non-registration, QAR 10,000 maximum fine | `rental-disputes-qatar`, `practice/real-estate`, `landing/qatar-law` | News reports and a law-firm summary; not yet on Al Meezan |
| **Cabinet Resolution No. 21 of 2026** on areas open to non-Qatari ownership (ten areas incl. Simaisma) | `property-ownership-non-qataris`, `practice/real-estate` | News reports. Residency thresholds (QAR 730,000 / 3.65m) are from 2020, so confirm they still apply |
| **Law No. 19 of 2025** amending the Advocacy Law: percentage fee cap 25%, regulated advertising, legal-aid committee moved to the SJC | `how-to-choose-a-lawyer-qatar`, `landing/qatar-law` | QNA / Al-Sharq report of the MOJ statement |
| **Law No. 11 of 2025**: Cybercrime Law Art. 8 bis (photographing people in public places without consent) | `cybercrime-qatar` | Secondary sources |
| **Law No. 8 of 2023** (Judicial Authority Law replacing Law 10/2003); **Law No. 4 of 2024** (Judicial Enforcement, cheques as enforceable instruments); **Law No. 1 of 2024** (partial payment of cheques); **Law No. 16 of 2024** (QFC appeal period 30 days); **Law No. 18 of 2025** (AML amendment); **2024 constitutional amendments** | several | Mostly confirmed via Al Meezan page titles, not full text |

## 2. Specific points to confirm

**Labour**
- Notice periods (1 month for up to 2 years' service, 2 months above) are from Decree-Law 18/2020 summaries; the Al Meezan copy still shows the old wording.
- Night-work premium hours in Article 74: the Arabic text read 9 pm–3 am, but the English translation differs.
- The labour committee's appeal deadline (15 days) and the "three weeks to decide" rule date from 2017 reporting and may have changed in 2026. Pages say only "within the statutory time limit".
- Daily rate = monthly basic wage ÷ 30 is presented as common practice, not statute.

**Family** (all from the SJC copy of Law No. 22 of 2006)
- The 30-day deadline for dividing estates under Law No. 4 of 2023: from the death, or from its registration?
- How courts reconcile Article 175 (custody by a non-Muslim mother up to age 7) with Article 182 (claim to remove custody from age 5).
- The court may refer couples to Wifaq (family consultation centre); source is UK government guidance only.

**Criminal / civil**
- Bounced cheques: the Penal Code Art. 357 penalty (3 months–3 years and/or QAR 3,000–10,000) is shown as in force. Confirm it is unchanged, and confirm that reconciliation ends the case.
- Travel-ban articles and grounds for lifting (Civil & Commercial Procedures Law) rest on a law-firm article. The SJC phone numbers are from 2022.
- General civil appeal period of 30 days (20 in urgent matters), and cassation 60 days.
- Investment and Trade Court deadlines (15 days to appeal, 30 days for cassation).

**Corporate / commercial**
- "No minimum capital for a WLL" and "QAR 10m for a holding company" come from an MOCI FAQ that is partly outdated.
- 10-year limitation between traders (Commercial Law No. 27 of 2006), stated without an article number.
- Law No. 1 of 2019 exclusions: "Qatar Petroleum" glossed as "now QatarEnergy".

**Names and descriptions**
- Arabic names: «الهيئة العامة لتنظيم القطاع العقاري (عقارات)», «محكمة قطر الدولية ومركز تسوية المنازعات», «المحكمة التنظيمية».
- The statement that Arbitration Law No. 2 of 2017 is modelled on the UNCITRAL Model Law was deliberately removed from the arbitration guide but may appear on the practice page; confirm.
- The old administrative page mentioned «ديوان المظالم», which Qatar does not have; the new page uses the grievance procedure and the Administrative Circuit.
- The corporate landing page (English) says the firm works "on retainer". Remove it if you don't offer retainers.

## 3. Firm facts only you can supply

- The founder's full biography, bar registration, qualifications and languages.
- Name and credentials of the lawyer who reviewed the guides, to show as author/reviewer on each.
- Whether "100+ successful cases" and "24/7 urgent consultations" (already on the site) are accurate.
- Other lawyers for the team page.
- Official profile links to add to `sameAs`: Google Business Profile, LinkedIn, Facebook.

## 4. Sources that are not official

Some pages cite law-firm or news articles (Clyde & Co, Crowell & Moring, K&L Gates, Pinsent Masons, DLA Piper, Al Ansari, Gulf Times, The Peninsula, Al-Sharq, QNA, Qatar Day). Where you can, replace them with the Al Meezan or ministry page, or remove them. The `sources` list is at the bottom of each content file.
