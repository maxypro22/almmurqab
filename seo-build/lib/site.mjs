/**
 * Site-wide facts, page SEO copy and UI labels for the SEO build.
 *
 * Firm details here feed the JSON-LD, footers, llms.txt and every template,
 * so a change of phone number or address is made once, in this file.
 */

export const SITE = "https://almurqablaw.com";
export const LOCALES = ["ar", "en"];

/** Last full review of the site copy. Used as lastmod and the dateModified floor. */
export const CONTENT_UPDATED = "2026-09-14";

export const FIRM = {
  name: { ar: "مكتب المرقاب للمحاماة", en: "Al Murqab Law Office" },
  short: { ar: "المرقاب للمحاماة", en: "Al Murqab Law" },
  description: {
    ar: "مكتب المرقاب للمحاماة أحد المكاتب الرائدة في دولة قطر. نتميّز بتقديم خدمات قانونية شاملة ومتخصصة للشركات والمؤسسات والأفراد، ونلتزم بأعلى معايير الشفافية والمصداقية لتحقيق أفضل النتائج لعملائنا.",
    en: "Al Murqab Law Office is a leading law firm in the State of Qatar. We provide comprehensive, specialised legal services to companies, institutions, and individuals — committed to the highest standards of transparency and integrity in pursuit of the best outcomes for our clients.",
  },
  phoneDial: "+97471900190",
  phoneDisplay: { ar: "٧١٩٠٠١٩٠", en: "7190 0190" },
  whatsapp: "https://wa.me/97471900190",
  email: "info@almurqablaw.com",
  street: { ar: "طريق سلوى — محطة بترول الجزيرة", en: "Salwa Road — Al Jazeera Petrol Station" },
  city: { ar: "الدوحة", en: "Doha" },
  country: { ar: "قطر", en: "Qatar" },
  lat: 25.2469,
  lng: 51.4749,
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Salwa%20Road%20%E2%80%94%20Al%20Jazeera%20Petrol%20Station%2C%20Doha%2C%20Qatar",
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  opens: "08:00",
  closes: "17:00",
  hours: {
    ar: "الأحد – الخميس، ٨:٠٠ صباحاً – ٥:٠٠ مساءً · استشارات عاجلة متاحة على مدار الساعة",
    en: "Sunday – Thursday, 8:00 AM – 5:00 PM · Urgent consultations available 24/7",
  },
  sameAs: ["https://www.instagram.com/almurqablaw", "https://www.tiktok.com/@almurqablaw", "https://x.com/almurqablaw"],
  image: "/images/firm/office-pic.jpg",
  logo: "/logo-lockup.png",
  founder: {
    slug: "abdullah-al-khawar",
    name: { ar: "عبدالله الخوار", en: "Abdullah Al-Khawar" },
    display: { ar: "أ/عبدالله الخوار", en: "Abdullah Al-Khawar" },
    role: { ar: "المؤسس", en: "Founder" },
    image: "/images/team/abdullah-al-khawar.jpg",
  },
};

const widths = (slug, list) => ({
  jpg: `/images/practice/${slug}.jpg`,
  src: `images/practice/${slug}-${list[list.length - 1]}.webp`,
  srcset: list.map((w) => `images/practice/${slug}-${w}.webp ${w}w`).join(", "),
});

/** The nine practice areas, in the order the site has always shown them. */
export const PRACTICE = [
  {
    slug: "criminal",
    num: "01",
    title: { ar: "القانون الجنائي", en: "Criminal Law" },
    summary: {
      ar: "نُقدّم دفاعاً قانونياً محترفاً في جميع القضايا الجنائية، ونحمي حقوق موكّلينا منذ لحظة التوقيف والاستجواب وحتى صدور الحكم النهائي، بأعلى معايير الكفاءة والنزاهة وفق القانون القطري.",
      en: "We provide professional criminal defence across all matters, protecting our clients' rights from the moment of arrest and questioning through to final judgment, to the highest standards of competence and integrity under Qatari law.",
    },
    image: widths("criminal", [640]),
  },
  {
    slug: "civil",
    num: "02",
    title: { ar: "القانون المدني", en: "Civil Law" },
    summary: {
      ar: "يتخصص فريقنا في النزاعات المدنية المعقدة، ويوفر تمثيلاً قانونياً قوياً للأفراد والشركات في دعاوى التعويض والمطالبات المدنية أمام المحاكم القطرية.",
      en: "Our team specialises in complex civil disputes, providing robust representation for individuals and companies in compensation claims and civil actions before the Qatari courts.",
    },
    image: widths("civil", [640]),
  },
  {
    slug: "commercial",
    num: "03",
    title: { ar: "القانون التجاري", en: "Commercial Law" },
    summary: {
      ar: "نُقدّم خدمات قانونية متكاملة في القانون التجاري، ونساعد الشركات والتجار على تسوية نزاعاتهم وصياغة اتفاقياتهم بما يتوافق مع القانون التجاري القطري ومتطلبات بيئة الأعمال الحديثة.",
      en: "We provide end-to-end commercial law services, helping companies and traders resolve disputes and structure agreements in line with Qatari commercial law and the demands of a modern business environment.",
    },
    image: widths("commercial", [640, 1080, 1255]),
  },
  {
    slug: "corporate",
    num: "04",
    title: { ar: "قانون الشركات", en: "Corporate Law" },
    summary: {
      ar: "نُرافق الشركات في كامل دورة حياتها القانونية؛ من التأسيس والهيكلة القانونية وصياغة العقود وحتى إعادة الهيكلة والدمج والاستحواذ، وفق قانون الشركات القطري ومعايير الحوكمة الدولية.",
      en: "We accompany companies through their entire legal life cycle — from incorporation and structuring, through contract drafting, to restructuring, mergers, and acquisitions — under Qatari company law and international governance standards.",
    },
    image: widths("corporate", [640, 1024]),
  },
  {
    slug: "administrative",
    num: "05",
    title: { ar: "القانون الإداري", en: "Administrative Law" },
    summary: {
      ar: "نُمثّل الأفراد والشركات في نزاعاتهم مع الجهات الحكومية والإدارية، ونوفر الخبرة اللازمة للطعن في القرارات الإدارية وحماية الحقوق أمام القضاء الإداري القطري.",
      en: "We represent individuals and companies in disputes with government and administrative bodies, providing the expertise needed to challenge administrative decisions and protect rights before Qatar's administrative courts.",
    },
    image: widths("administrative", [640, 1080, 1600]),
  },
  {
    slug: "real-estate",
    num: "06",
    title: { ar: "القانون العقاري", en: "Real Estate Law" },
    summary: {
      ar: "نُوفّر استشارات وتمثيلاً قانونياً متخصصاً في كافة جوانب المعاملات العقارية والمقاولات في دولة قطر، من الصياغة التعاقدية وتسجيل الملكية وحتى تسوية النزاعات أمام المحاكم المختصة.",
      en: "We provide specialised advice and representation across every aspect of real estate and construction in Qatar — from contract drafting and title registration through to dispute resolution before the competent courts.",
    },
    image: widths("real-estate", [640, 1024]),
  },
  {
    slug: "labor",
    num: "07",
    title: { ar: "قانون العمل", en: "Labour Law" },
    summary: {
      ar: "نُقدّم خدمات قانونية عمالية شاملة للعمال وأصحاب العمل على حد سواء، ونضمن الامتثال الكامل لأحكام قانون العمل القطري في بيئة عمل متوازنة ترسّخ الحقوق والواجبات.",
      en: "We provide comprehensive employment law services to both employees and employers, ensuring full compliance with Qatari labour law in a balanced workplace that upholds rights and obligations alike.",
    },
    image: widths("labor", [640, 1024]),
  },
  {
    slug: "family",
    num: "08",
    title: { ar: "قانون الأسرة", en: "Family Law" },
    summary: {
      ar: "نتعامل مع قضايا الأسرة بمنتهى الحساسية والسرية التامة، ونعمل على تحقيق أفضل النتائج لموكّلينا في كافة مسائل الأحوال الشخصية وفقاً للشريعة الإسلامية والتشريع القطري.",
      en: "We handle family matters with the utmost sensitivity and complete confidentiality, working to achieve the best outcomes for our clients across all personal status matters under Islamic Sharia and Qatari legislation.",
    },
    image: widths("family", [640, 1024]),
  },
  {
    slug: "arbitration",
    num: "09",
    title: { ar: "التحكيم وتسوية النزاعات", en: "Arbitration & Dispute Resolution" },
    summary: {
      ar: "نُقدّم خدمات تحكيم ووساطة على المستويين المحلي والدولي، ونُمثّل موكّلينا في إجراءات التحكيم وفق أبرز قواعد التحكيم الدولية، بما يضمن تسويات سريعة وفعّالة وبأقل التكاليف.",
      en: "We provide arbitration and mediation services domestically and internationally, representing clients under the leading international arbitration rules to reach fast, effective settlements at the lowest cost.",
    },
    image: widths("arbitration", [640, 1024]),
  },
];

export const practiceBySlug = Object.fromEntries(PRACTICE.map((p) => [p.slug, p]));

/** Order of practice-area groups on the insights index. High-demand topics first. */
export const CATEGORY_ORDER = ["labor", "corporate", "commercial", "family", "criminal", "real-estate", "civil", "administrative", "arbitration"];

/** Keyword landing pages. Content lives in content/landing/<slug>.mjs. */
export const LANDING = [
  { slug: "legal-consultation", title: { ar: "استشارات قانونية", en: "Legal Consultation" } },
  { slug: "corporate-legal-consultancy", title: { ar: "استشارات الشركات", en: "Corporate Legal Services" } },
  { slug: "qatar-law", title: { ar: "دليل القانون القطري", en: "Qatar Law Guide" } },
];

/**
 * SEO copy for the pages the build patches rather than generates.
 * Titles are complete (brand included); descriptions stay under ~160 chars.
 */
export const PAGES = {
  "": {
    ar: {
      title: "محامي في قطر | مكتب المرقاب للمحاماة والاستشارات القانونية",
      description:
        "مكتب المرقاب للمحاماة في الدوحة: محامون واستشارات قانونية في قطر للأفراد والشركات في قضايا الشركات والعمل والأسرة والجنايات والعقارات. اتصل: ٧١٩٠٠١٩٠",
    },
    en: {
      title: "Lawyers in Qatar | Al Murqab Law Office — Doha Law Firm",
      description:
        "Qatari law firm in Doha: legal consultation and court representation in corporate, commercial, labour, family, criminal and real estate law. Call 7190 0190.",
    },
  },
  about: {
    ar: {
      title: "عن المكتب — مكتب محاماة قطري في الدوحة | المرقاب للمحاماة",
      description:
        "تعرّف على مكتب المرقاب للمحاماة: مكتب محاماة قطري في الدوحة يقدّم استشارات قانونية وتمثيلاً أمام المحاكم للأفراد والشركات بالعربية والإنجليزية وبسرّية تامة.",
    },
    en: {
      title: "About Us — Qatari Law Firm in Doha | Al Murqab Law",
      description:
        "Al Murqab Law Office is a Qatari law firm in Doha providing legal advice and court representation to individuals and companies, in Arabic and English, in complete confidence.",
    },
  },
  contact: {
    ar: {
      title: "اتصل بنا — احجز استشارة مع محامٍ في الدوحة | المرقاب للمحاماة",
      description:
        "تواصل مع مكتب المرقاب للمحاماة في الدوحة عبر الهاتف أو واتساب ٧١٩٠٠١٩٠ أو البريد الإلكتروني. طريق سلوى، الدوحة. استشارات قانونية عاجلة على مدار الساعة.",
    },
    en: {
      title: "Contact a Lawyer in Doha — Book a Consultation | Al Murqab Law",
      description:
        "Contact Al Murqab Law Office in Doha by phone or WhatsApp on 7190 0190 or by email. Salwa Road, Doha. Urgent legal consultations available 24/7.",
    },
  },
  team: {
    ar: {
      title: "فريق المكتب — محامون ومستشارون قانونيون في قطر | المرقاب للمحاماة",
      description:
        "تعرّف على فريق مكتب المرقاب للمحاماة في الدوحة: محامون ومستشارون قانونيون ذوو خبرة في النظام القانوني القطري، يتولّون ملفات الأفراد والشركات.",
    },
    en: {
      title: "Our Team — Lawyers & Legal Consultants in Qatar | Al Murqab Law",
      description:
        "Meet the team at Al Murqab Law Office in Doha: advocates and legal consultants experienced in the Qatari legal system, acting for individuals and companies.",
    },
  },
  "team/abdullah-al-khawar": {
    ar: {
      title: "أ/عبدالله الخوار — مؤسس مكتب المرقاب للمحاماة",
      description:
        "أ/عبدالله الخوار، مؤسس مكتب المرقاب للمحاماة في الدوحة، قطر. للتواصل وحجز استشارة قانونية: ٧١٩٠٠١٩٠ أو info@almurqablaw.com.",
    },
    en: {
      title: "Abdullah Al-Khawar — Founder, Al Murqab Law Office",
      description:
        "Abdullah Al-Khawar is the founder of Al Murqab Law Office in Doha, Qatar. To arrange a legal consultation, call 7190 0190 or email info@almurqablaw.com.",
    },
  },
  "practice-areas": {
    ar: {
      title: "الخدمات القانونية في قطر — مجالات الممارسة | المرقاب للمحاماة",
      description:
        "خدمات قانونية شاملة في قطر: محامي جنائي، مدني، تجاري، شركات، إداري، عقارات، قضايا عمالية، أحوال شخصية، وتحكيم. استشارة وتمثيل أمام المحاكم القطرية.",
      h1: "خدماتنا القانونية في قطر",
    },
    en: {
      title: "Legal Services in Qatar — Practice Areas | Al Murqab Law",
      description:
        "Full-service legal practice in Qatar: criminal, civil, commercial, corporate, administrative, real estate, labour and family law, and arbitration — advice and representation.",
      h1: "Our Legal Services in Qatar",
    },
  },
  insights: {
    ar: {
      title: "مقالات قانونية عن القانون القطري — أدلة عملية | المرقاب للمحاماة",
      description:
        "أدلة قانونية مبسّطة عن القانون القطري: قانون العمل، تأسيس الشركات، الطلاق والحضانة، الإيجارات، منع السفر وغيرها — يكتبها الفريق القانوني لمكتب المرقاب.",
      eyebrow: "رؤى قانونية",
      h1: "مقالات وأدلة في القانون القطري",
      lede: "إجابات واضحة وموثّقة على أكثر الأسئلة القانونية شيوعاً في قطر، مع الإشارة إلى نصوص القوانين ومصادرها الرسمية.",
    },
    en: {
      title: "Qatar Law Insights — Practical Legal Guides | Al Murqab Law",
      description:
        "Plain-language guides to Qatari law: labour rights, company formation, divorce and custody, rent disputes, travel bans and more — from the Al Murqab Law legal team.",
      eyebrow: "Legal insights",
      h1: "Guides to Qatari Law",
      lede: "Clear, sourced answers to the legal questions people in Qatar ask most — with references to the legislation and its official sources.",
    },
  },
};

export const L = {
  ar: {
    brand: "المرقاب للمحاماة",
    home: "الرئيسية",
    about: "من نحن",
    practiceAreas: "مجالات الممارسة",
    team: "الفريق",
    insights: "المقالات",
    contact: "اتصل بنا",
    quickLinks: "روابط سريعة",
    breadcrumb: "مسار التنقل",
    faqTitle: "أسئلة شائعة",
    sources: "المصادر",
    published: "نُشر",
    updated: "آخر تحديث",
    minRead: "دقائق قراءة",
    toc: "محتويات المقال",
    onPage: "في هذه الصفحة",
    preparedBy: "إعداد",
    author: "الفريق القانوني لمكتب المرقاب للمحاماة",
    authorRole: "مكتب محاماة قطري — الدوحة",
    practiceArea: "مجال الممارسة",
    keyPoints: "الخلاصة",
    related: "أدلة ذات صلة",
    readMore: "اقرأ المزيد →",
    allInsights: "جميع المقالات →",
    call: "اتصل بنا",
    whatsapp: "واتساب",
    book: "احجز استشارة",
    ctaTitle: "حقوقك في أمان مع خبرائنا",
    ctaText: "فريقنا المتخصص جاهز للإجابة على استفساراتك. تواصل معنا اليوم لتحديد موعد استشارة.",
    askTitle: "هل لديك سؤال عن حالتك؟",
    askText: "كل حالة تختلف بظروفها. تحدّث مع أحد محامينا في سرّية تامة.",
    services: "ما نتولّاه في هذا المجال",
    process: "كيف نعمل على ملفك",
    otherAreas: "مجالات ممارسة أخرى",
    inQatar: (t) => `${t} في قطر`,
    confidential: "لكل ملف ظروفه. تواصل معنا لمناقشة تفاصيل قضيتك مع أحد محامينا في سرّية تامة.",
    disclaimer:
      "هذا المحتوى معلومات عامة عن القانون القطري وليس استشارة قانونية، ولا تنشأ به علاقة موكّل بمحامٍ. تختلف كل حالة بظروفها، وقد تتغيّر التشريعات. للحصول على رأي في وضعك تحديداً، تواصل معنا.",
    noArticles: "لا توجد مقالات منشورة بعد.",
    guidesByArea: "أدلة حسب المجال",
    viewArea: "صفحة المجال →",
  },
  en: {
    brand: "Al Murqab Law",
    home: "Home",
    about: "About",
    practiceAreas: "Practice Areas",
    team: "Team",
    insights: "Insights",
    contact: "Contact",
    quickLinks: "Quick links",
    breadcrumb: "Breadcrumb",
    faqTitle: "Frequently asked questions",
    sources: "Sources",
    published: "Published",
    updated: "Last updated",
    minRead: "min read",
    toc: "In this article",
    onPage: "On this page",
    preparedBy: "Prepared by",
    author: "Legal team, Al Murqab Law Office",
    authorRole: "Qatari law firm — Doha",
    practiceArea: "Practice area",
    keyPoints: "Key points",
    related: "Related guides",
    readMore: "Read More →",
    allInsights: "All insights →",
    call: "Call Us",
    whatsapp: "WhatsApp",
    book: "Book a Consultation",
    ctaTitle: "Your rights are safe with our experts",
    ctaText: "Our specialist team is ready to answer your questions. Get in touch today to arrange a consultation.",
    askTitle: "A question about your situation?",
    askText: "Every case turns on its own facts. Speak to one of our advocates in complete confidence.",
    services: "What we handle in this area",
    process: "How we work on your matter",
    otherAreas: "Other practice areas",
    inQatar: (t) => `${t} in Qatar`,
    confidential: "Every matter is different. Contact us to discuss the details of your case with one of our advocates, in complete confidence.",
    disclaimer:
      "This content is general information about Qatari law, not legal advice, and no lawyer–client relationship arises from it. Every situation turns on its own facts, and legislation changes. For an opinion on your specific position, contact us.",
    noArticles: "No articles published yet.",
    guidesByArea: "Guides by area",
    viewArea: "Practice area →",
  },
};
