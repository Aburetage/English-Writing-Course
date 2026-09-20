/* ===== English Writing Course — Vocabulary Bank ===== */

export const VOCABULARY = {
  nouns: [
    { en: "word", ar: "كلمة" },
    { en: "phrase", ar: "عبارة" },
    { en: "clause", ar: "جملة ذات إسناد" },
    { en: "sentence", ar: "جملة" },
    { en: "paragraph", ar: "فقرة" },
    { en: "essay", ar: "مقال" },
    { en: "subject", ar: "فاعل" },
    { en: "predicate", ar: "مسند" },
    { en: "object", ar: "مفعول به" },
    { en: "verb", ar: "فعل" },
    { en: "noun", ar: "اسم" },
    { en: "pronoun", ar: "ضمير" },
    { en: "adjective", ar: "صفة" },
    { en: "adverb", ar: "حال" },
    { en: "preposition", ar: "حرف جر" },
    { en: "conjunction", ar: "أداة ربط" },
    { en: "article", ar: "أداة تعريف/تنكير" },
    { en: "farmer", ar: "مزارع" },
    { en: "plant", ar: "نبات" },
    { en: "crop", ar: "محصول" },
    { en: "soil", ar: "تربة" },
    { en: "water", ar: "ماء" },
    { en: "irrigation", ar: "ري" },
    { en: "greenhouse", ar: "صوبة زراعية" },
    { en: "field", ar: "حقل" },
    { en: "manager", ar: "مدير" },
    { en: "engineer", ar: "مهندس" },
    { en: "machine", ar: "آلة" },
    { en: "system", ar: "نظام" },
    { en: "maintenance", ar: "صيانة" }
  ],

  verbs: [
    { en: "write", ar: "يكتب" },
    { en: "read", ar: "يقرأ" },
    { en: "work", ar: "يعمل" },
    { en: "check", ar: "يفحص" },
    { en: "monitor", ar: "يراقب" },
    { en: "grow", ar: "ينمو / يزرع" },
    { en: "need", ar: "يحتاج" },
    { en: "use", ar: "يستخدم" },
    { en: "improve", ar: "يحسن" },
    { en: "require", ar: "يتطلب" },
    { en: "study", ar: "يدرس" },
    { en: "practice", ar: "يتدرب" },
    { en: "connect", ar: "يربط" },
    { en: "describe", ar: "يصف" },
    { en: "identify", ar: "يحدد" }
  ],

  adjectives: [
    { en: "new", ar: "جديد" },
    { en: "young", ar: "شاب" },
    { en: "old", ar: "قديم / عجوز" },
    { en: "experienced", ar: "ذو خبرة" },
    { en: "careful", ar: "حذر" },
    { en: "efficient", ar: "كفء" },
    { en: "healthy", ar: "صحي" },
    { en: "modern", ar: "حديث" },
    { en: "regular", ar: "منتظم" },
    { en: "important", ar: "مهم" }
  ],

  adverbs: [
    { en: "carefully", ar: "بعناية" },
    { en: "quickly", ar: "بسرعة" },
    { en: "efficiently", ar: "بكفاءة" },
    { en: "regularly", ar: "بانتظام" },
    { en: "extremely", ar: "بشدة" },
    { en: "very", ar: "جدًا" },
    { en: "always", ar: "دائمًا" },
    { en: "sometimes", ar: "أحيانًا" }
  ],

  conjunctions: [
    { en: "and", ar: "و" },
    { en: "but", ar: "لكن" },
    { en: "or", ar: "أو" },
    { en: "because", ar: "لأن" },
    { en: "although", ar: "رغم أن" },
    { en: "if", ar: "إذا" }
  ],

  prepositions: [
    { en: "in", ar: "في" },
    { en: "on", ar: "على" },
    { en: "at", ar: "عند" },
    { en: "by", ar: "بجوار / بواسطة" },
    { en: "under", ar: "تحت" },
    { en: "from", ar: "من" },
    { en: "to", ar: "إلى" },
    { en: "with", ar: "مع" }
  ]
};

export function searchVocabulary(query) {
  const q = String(query || "").trim().toLowerCase();

  if (!q) return [];

  const all = [
    ...VOCABULARY.nouns.map((item) => ({ ...item, type: "Noun" })),
    ...VOCABULARY.verbs.map((item) => ({ ...item, type: "Verb" })),
    ...VOCABULARY.adjectives.map((item) => ({ ...item, type: "Adjective" })),
    ...VOCABULARY.adverbs.map((item) => ({ ...item, type: "Adverb" })),
    ...VOCABULARY.conjunctions.map((item) => ({ ...item, type: "Conjunction" })),
    ...VOCABULARY.prepositions.map((item) => ({ ...item, type: "Preposition" }))
  ];

  return all.filter((item) => {
    return (
      item.en.toLowerCase().includes(q) ||
      item.ar.includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });
}