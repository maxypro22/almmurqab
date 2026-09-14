/**
 * Copy the build adds to existing pages: the home page (H1, "how we help",
 * featured guides, FAQ), the about page and the practice-areas index.
 */
export default {
  /** Guides shown on the home page, in order. Missing slugs are skipped. */
  featured: [
    "foreign-ownership-company-formation-qatar",
    "alimony-nafaqa-qatar",
    "commercial-agency-qatar",
    "administrative-decisions-appeal-qatar",
    "how-to-choose-a-lawyer-qatar",
    "end-of-service-gratuity-qatar",
  ],

  ar: {
    h1: ["محامي في قطر", "خبرة قانونية تتجاوز التوقعات"],
    help: {
      eyebrow: "كيف نساعدك",
      h2: "محامون واستشارات قانونية في قطر للأفراد والشركات",
      paragraphs: [
        "سواء كنت فرداً يواجه نزاعاً عمالياً أو أسرياً، أو شركة تحتاج إلى مستشار قانوني دائم، أو مستثمراً يؤسس أعماله في قطر، يقدّم مكتب المرقاب للمحاماة في الدوحة استشارات قانونية وتمثيلاً أمام المحاكم القطرية باللغتين العربية والإنجليزية.",
        'نبدأ بفهم موقفك وأهدافك، ونشرح لك خياراتك القانونية بوضوح قبل اتخاذ أي خطوة، ثم نتابع ملفك حتى نهايته — بسرّية مهنية تامة. تعرّف على <a href="/ar/legal-consultation">طريقة حجز استشارة قانونية</a> أو تصفّح <a href="/ar/qatar-law">دليل القانون القطري</a>.',
      ],
      cards: [
        {
          key: "legal-consultation",
          title: "استشارات قانونية في قطر",
          text: "استشارة مع محامٍ في مكتبنا بالدوحة أو عبر الهاتف وواتساب، مع استشارات عاجلة متاحة على مدار الساعة.",
        },
        {
          key: "corporate-legal-consultancy",
          title: "استشارات قانونية للشركات",
          text: "مستشار قانوني لشركتك: التأسيس، والعقود، والامتثال، وقضايا العمل، وتحصيل المستحقات.",
        },
        {
          key: "qatar-law",
          title: "دليل القانون القطري",
          text: "شرح مبسّط لأهم القوانين القطرية ودرجات التقاضي والمحاكم، مع أدلة عملية لكل مجال.",
        },
      ],
    },
    guides: { eyebrow: "أدلة قانونية", h2: "إجابات واضحة عن القانون القطري" },
    faqTitle: "أسئلة شائعة عن الاستشارات القانونية في قطر",
    faqs: [
      {
        q: "كيف أتواصل مع محامٍ في مكتب المرقاب للمحاماة؟",
        a: "يمكنك الاتصال بنا أو مراسلتنا عبر واتساب على الرقم ٧١٩٠٠١٩٠، أو إرسال بريد إلكتروني إلى info@almurqablaw.com، أو زيارة مكتبنا على طريق سلوى في الدوحة من الأحد إلى الخميس بين الثامنة صباحاً والخامسة مساءً. الاستشارات العاجلة متاحة على مدار الساعة.",
      },
      {
        q: "ما مجالات القانون التي يتولاها مكتب المرقاب للمحاماة؟",
        a: "نتولى القضايا والاستشارات في القانون الجنائي والمدني والتجاري وقانون الشركات والقانون الإداري والعقاري وقانون العمل وقانون الأسرة، إضافة إلى التحكيم وتسوية النزاعات، للأفراد والشركات على حد سواء.",
      },
      {
        q: "هل تقدّمون استشارات قانونية للشركات والمستثمرين الأجانب في قطر؟",
        a: "نعم. نقدّم للشركات استشارات في التأسيس والهيكلة وصياغة العقود والامتثال ونزاعات الشركاء، ونساعد المستثمرين غير القطريين على فهم متطلبات الاستثمار وتأسيس الأعمال في قطر.",
      },
      {
        q: "هل يمكن الحصول على الاستشارة القانونية باللغة الإنجليزية؟",
        a: "نعم. نقدّم الاستشارات والمراسلات والتمثيل القانوني باللغتين العربية والإنجليزية، ونتعامل بانتظام مع المقيمين والشركات الأجنبية في قطر.",
      },
      {
        q: "ماذا أُحضر معي إلى الاستشارة القانونية الأولى؟",
        a: "أحضر نسخاً من المستندات المتعلقة بموضوعك، مثل العقود والمراسلات والإنذارات وأي أحكام أو قرارات سابقة، مع بطاقتك الشخصية وملخص زمني مختصر للوقائع. يساعد ذلك المحامي على تقييم موقفك بدقة من الجلسة الأولى.",
      },
      {
        q: "هل المعلومات التي أشاركها مع المحامي سرّية؟",
        a: "نعم. كل ما يشاركه الموكّل يخضع للسرّية المهنية التامة، وهو التزام قانوني وأخلاقي نلتزم به في كل ملف.",
      },
      {
        q: "كيف تُحدَّد أتعاب المحاماة؟",
        a: "تختلف الأتعاب بحسب طبيعة القضية وتعقيدها ومرحلتها، ويُتفق عليها كتابةً مع الموكّل قبل البدء في العمل، حتى تكون الصورة واضحة منذ البداية.",
      },
    ],
    about: {
      eyebrow: "المكتب",
      h2: "مكتب محاماة قطري في الدوحة",
      lede: "من مقرّنا على طريق سلوى في الدوحة، نقدّم الاستشارات القانونية والتمثيل أمام المحاكم والجهات القضائية في قطر، باللغتين العربية والإنجليزية.",
      html:
        '<p>نعمل مع الأفراد والعائلات والشركات والمستثمرين في تسعة <a href="/ar/practice-areas">مجالات ممارسة</a>، من القضايا الجنائية والمدنية إلى قانون الشركات والتحكيم وتسوية النزاعات.</p>' +
        '<p>يمكنك <a href="/ar/legal-consultation">حجز استشارة قانونية</a> في المكتب أو عبر الهاتف وواتساب، وتتوفر الاستشارات العاجلة على مدار الساعة. وللشركات، نقدّم <a href="/ar/corporate-legal-consultancy">استشارات قانونية مستمرة</a> تغطي التأسيس والعقود والامتثال. كما ننشر <a href="/ar/insights">أدلة قانونية مبسّطة</a> تساعدك على فهم موقفك قبل أن تتصرّف.</p>',
      founderLink: "الملف التعريفي →",
    },
    practiceIndex: { eyebrow: "خدمات قد تحتاجها" },
  },

  en: {
    h1: ["Lawyers in Qatar", "Legal expertise beyond expectation"],
    help: {
      eyebrow: "How we help",
      h2: "Lawyers and legal consultation in Qatar, for individuals and companies",
      paragraphs: [
        "Whether you are an individual facing an employment or family dispute, a company that needs an ongoing legal adviser, or an investor setting up in Qatar, Al Murqab Law Office in Doha provides legal consultation and representation before the Qatari courts, in Arabic and English.",
        'We start by understanding your position and your goals, explain your legal options clearly before any step is taken, and stay with your matter to the end — in complete professional confidence. See <a href="/en/legal-consultation">how to book a legal consultation</a> or browse our <a href="/en/qatar-law">guide to Qatari law</a>.',
      ],
      cards: [
        {
          key: "legal-consultation",
          title: "Legal consultation in Qatar",
          text: "Meet a lawyer at our Doha office or consult by phone or WhatsApp, with urgent consultations available 24/7.",
        },
        {
          key: "corporate-legal-consultancy",
          title: "Corporate legal services",
          text: "Legal counsel for your business: formation, contracts, compliance, employment matters and debt recovery.",
        },
        {
          key: "qatar-law",
          title: "Qatar law guide",
          text: "A plain-language overview of Qatar's key laws, courts and litigation process, with practical guides for each area.",
        },
      ],
    },
    guides: { eyebrow: "Legal guides", h2: "Clear answers on Qatari law" },
    faqTitle: "Frequently asked questions about legal advice in Qatar",
    faqs: [
      {
        q: "How do I contact a lawyer at Al Murqab Law Office?",
        a: "Call or WhatsApp us on 7190 0190, email info@almurqablaw.com, or visit our office on Salwa Road in Doha, Sunday to Thursday from 8:00 AM to 5:00 PM. Urgent consultations are available 24/7.",
      },
      {
        q: "What areas of law does Al Murqab Law Office handle?",
        a: "We advise and act in criminal, civil, commercial, corporate, administrative, real estate, labour and family law, as well as arbitration and dispute resolution — for individuals and companies alike.",
      },
      {
        q: "Do you advise companies and foreign investors in Qatar?",
        a: "Yes. We advise companies on formation, structuring, contract drafting, compliance and shareholder disputes, and help non-Qatari investors understand the rules on investing and setting up a business in Qatar.",
      },
      {
        q: "Can I get legal advice in English?",
        a: "Yes. We provide consultations, correspondence and legal representation in both Arabic and English, and regularly work with expatriates and foreign companies in Qatar.",
      },
      {
        q: "What should I bring to my first legal consultation?",
        a: "Bring copies of the documents relevant to your matter — contracts, correspondence, notices and any earlier judgments or decisions — with your ID and a short timeline of events. This lets the lawyer assess your position accurately from the first meeting.",
      },
      {
        q: "Is what I tell a lawyer confidential?",
        a: "Yes. Everything a client shares is subject to complete professional confidentiality — a legal and ethical obligation we uphold on every matter.",
      },
      {
        q: "How are legal fees agreed?",
        a: "Fees depend on the nature, complexity and stage of the matter, and are agreed with the client in writing before work begins, so the position is clear from the outset.",
      },
    ],
    about: {
      eyebrow: "The firm",
      h2: "A Qatari law firm in Doha",
      lede: "From our office on Salwa Road in Doha, we provide legal consultation and representation before the courts and judicial bodies of Qatar, in Arabic and English.",
      html:
        '<p>We act for individuals, families, companies and investors across nine <a href="/en/practice-areas">practice areas</a>, from criminal and civil matters to corporate law, arbitration and dispute resolution.</p>' +
        '<p>You can <a href="/en/legal-consultation">book a legal consultation</a> at our office or by phone and WhatsApp, with urgent consultations available around the clock. For businesses, we provide <a href="/en/corporate-legal-consultancy">ongoing corporate legal counsel</a> covering formation, contracts and compliance. We also publish <a href="/en/insights">plain-language legal guides</a> to help you understand your position before you act.</p>',
      founderLink: "View profile →",
    },
    practiceIndex: { eyebrow: "Services you may need" },
  },
};
