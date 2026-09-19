/* ===== English Writing Course — Course Registry ===== */

export const COURSE = {
  titleEn: "English Writing Course",
  titleAr: "كورس الكتابة باللغة الإنجليزية",
  lessons: [
    {
      n: 1,
      file: "lesson1.html",
      en: "Definitions",
      ar: "التعريفات والمفاهيم الأساسية",
      phase: "الأساسيات",
      ex: 5,
      min: 25,
      desc: "نبدأ بالمفاهيم الأساسية التي سنحتاج إليها لفهم بقية الكورس."
    },
    {
      n: 2,
      file: "lesson2.html",
      en: "Parts of Speech",
      ar: "أجزاء الكلام",
      phase: "الأساسيات",
      ex: 15,
      min: 45,
      desc: "نفهم أنواع الكلمات ووظائفها وعلاقاتها داخل الجملة."
    },
    {
      n: 3,
      file: "lesson3.html",
      en: "Practice on Parts of Speech",
      ar: "التطبيق على أقسام الكلام",
      phase: "الأساسيات",
      ex: 34,
      min: 50,
      desc: "نحول معرفة أقسام الكلام إلى قدرة عملية على التعرف إليها واستخدامها."
    },
    {
      n: 4,
      file: "lesson4.html",
      en: "How to Structure a Sentence",
      ar: "كيفية بناء الجملة",
      phase: "الجملة",
      ex: 15,
      min: 45,
      desc: "ننتقل من معرفة الكلمات ووظائفها إلى بناء الجملة."
    },
    {
      n: 5,
      file: null,
      en: "Types of Sentences",
      ar: "أنواع الجمل",
      phase: "الجملة",
      ex: 0,
      min: 0,
      desc: "نتعرف إلى الأنواع المختلفة للجمل وكيفية استخدامها."
    },
    {
      n: 6,
      file: null,
      en: "Practice on Types of Sentences",
      ar: "التدريبات على أنواع الجمل",
      phase: "الجملة",
      ex: 0,
      min: 0,
      desc: "نطبق ما تعلمناه ونطور قدرتنا على تحليل الجمل واستخدامها."
    },
    {
      n: 7,
      file: null,
      en: "The Punctuation Marks",
      ar: "علامات الترقيم",
      phase: "الترقيم",
      ex: 0,
      min: 0,
      desc: "نتعلم كيف تساعد علامات الترقيم في تنظيم الكتابة وتوضيح المعنى."
    },
    {
      n: 8,
      file: null,
      en: "Practice on the Punctuation Marks",
      ar: "التدريبات على علامات الترقيم",
      phase: "الترقيم",
      ex: 0,
      min: 0,
      desc: "نحول قواعد الترقيم إلى استخدام عملي."
    },
    {
      n: 9,
      file: null,
      en: "How to Structure a Paragraph",
      ar: "كيفية بناء الفقرة",
      phase: "الفقرة",
      ex: 0,
      min: 0,
      desc: "ننتقل من بناء الجملة إلى تنظيم مجموعة من الجمل حول فكرة واحدة."
    },
    {
      n: 10,
      file: null,
      en: "Practice on Topic, Supporting, and Concluding Sentences",
      ar: "التدريب على الجملة الرئيسية والجمل الداعمة والختامية",
      phase: "الفقرة",
      ex: 0,
      min: 0,
      desc: "نتعلم عمليًا كيف تتعاون أنواع الجمل المختلفة لبناء فقرة متماسكة."
    },
    {
      n: 11,
      file: null,
      en: "Practice on Writing a Paragraph",
      ar: "التدريب على كتابة فقرة",
      phase: "الفقرة",
      ex: 0,
      min: 0,
      desc: "نبدأ بإنتاج فقرة كاملة بأنفسنا."
    },
    {
      n: 12,
      file: null,
      en: "Types of Essays",
      ar: "أنواع المقالات",
      phase: "المقال",
      ex: 0,
      min: 0,
      desc: "بعد إتقان أساسيات الفقرة، ننتقل إلى المستوى الأكبر: المقال."
    },
    {
      n: 13,
      file: null,
      en: "How to Structure an Essay",
      ar: "كيفية بناء المقال",
      phase: "المقال",
      ex: 0,
      min: 0,
      desc: "نتعلم كيفية تنظيم المقال وربط أجزائه وفقراته."
    },
    {
      n: 14,
      file: null,
      en: "Common Academic Essay Writing Mistakes",
      ar: "الأخطاء الشائعة في كتابة المقال الأكاديمي",
      phase: "المقال",
      ex: 0,
      min: 0,
      desc: "نتعرف إلى الأخطاء التي يمكن أن تضعف جودة الكتابة الأكاديمية وكيفية تجنبها."
    },
    {
      n: 15,
      file: null,
      en: "Citation and Bibliography",
      ar: "التوثيق وقائمة المراجع",
      phase: "المقال",
      ex: 0,
      min: 0,
      desc: "نتعلم أساسيات التعامل مع المصادر وتوثيقها في الكتابة الأكاديمية."
    },
    {
      n: 16,
      file: null,
      en: "Practice on Essay Writing",
      ar: "التدريب على كتابة مقال",
      phase: "المقال",
      ex: 0,
      min: 0,
      desc: "نصل إلى المرحلة التطبيقية النهائية، حيث نستخدم المهارات التي بنيناها تدريجيًا لكتابة مقال."
    }
  ]
};

/**
 * توافق مع الكود القديم إن وُجد.
 */
if (typeof window !== "undefined") {
  window.COURSE = COURSE;
}

export function getLessonByNumber(n) {
  return COURSE.lessons.find((lesson) => lesson.n === n) || null;
}

export function getAvailableLessons() {
  return COURSE.lessons.filter((lesson) => Boolean(lesson.file));
}

export function getFirstAvailableLesson() {
  return getAvailableLessons()[0] || null;
}

export function getLatestAvailableLesson() {
  const available = getAvailableLessons();
  return available.length ? available[available.length - 1] : null;
}