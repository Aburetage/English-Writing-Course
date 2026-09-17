/* ===== English Writing Course — Site-Wide Engine (Registry-Driven) ===== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ===== السجل: مصدر الحقيقة ===== */
let LESSONS = (typeof COURSE !== 'undefined' && COURSE && COURSE.lessons) ? COURSE.lessons : [];
let AVAIL = LESSONS.filter(x => x.file);

function refreshRegistry() {
  LESSONS = (typeof COURSE !== 'undefined' && COURSE && COURSE.lessons) ? COURSE.lessons : [];
  AVAIL = LESSONS.filter(x => x.file);
}

const curLesson = parseInt(document.body.dataset.lesson || '0', 10);
const L = n => LESSONS.find(x => x.n === n);
const visKey = n => 'l' + n + 'vis';
const isVis = n => localStorage.getItem(visKey(n)) !== null;

if (curLesson > 0) localStorage.setItem(visKey(curLesson), '1');

/* ===== تحديث حالة الدروس في الفهرس ===== */
function updateTocProgress() {
  $$('#toc a[href^="lesson"]').forEach(a => {
    const href = a.getAttribute('href');
    const match = href.match(/lesson(\d+)\.html/);
    if (match) {
      const n = parseInt(match[1], 10);
      let check = a.querySelector('.toc-check');
      if (!check) {
        check = document.createElement('span');
        check.className = 'toc-check';
        check.innerHTML = '✓';
        a.appendChild(check);
      }
      const done = isVis(n);
      check.classList.toggle('done', done);
      a.classList.toggle('done', done);
    }
  });
}

/* حقن CSS مرة واحدة: بادج جديد + أنماط الخريطة الذهنية */
(function () {
  const s = document.createElement('style');
  s.textContent = '.lnew{background:linear-gradient(135deg,#e67e22,#f39c12);color:#fff;border-radius:999px;padding:2px 12px;font-size:.68rem;font-weight:900;box-shadow:0 4px 10px rgba(230,126,34,.4)}.vflow{display:flex;flex-direction:column;gap:4px;align-items:center;margin:16px 0}.vstep{background:var(--glass2);border:1px solid var(--brd2);border-radius:999px;padding:6px 22px;font-weight:800;font-size:.85rem;backdrop-filter:blur(8px);text-align:center}.vstep .e{font-size:.85rem}.varr{color:var(--primary);font-weight:900;font-size:.9rem}';
  document.head.appendChild(s);
})();

/* ===== رسم الخريطة ديناميكيًا (الرئيسية فقط) + تشخيص مرئي عند الفشل ===== */
function renderRoadmap() {
  const host = $('#roadmapStations');
  if (!host) return;
  if (!LESSONS.length) {
    console.error('[EWC] سجل الكورس غير متاح: تحقق أن course-data.js موجود ويُحمَّل قبل course.js وخالٍ من أخطاء الصياغة.');
    host.innerHTML = '<div class="alert"><span class="aic">⚠️</span><p>الخريطة لا يمكن رسمها: ملف <b>course-data.js</b> غير محمول أو به خطأ صياغة. افتح Console للتفاصيل.</p></div>';
    return;
  }
  const phases = [];
  LESSONS.forEach(l => {
    const p = phases.find(x => x.name === l.phase);
    if (p) p.ls.push(l); else phases.push({ name: l.phase, ls: [l] });
  });
  const newestN = AVAIL.length ? AVAIL[AVAIL.length - 1].n : -1;
  host.innerHTML = phases.map((p, pi) =>
    `<div class="phase"><span class="phead">المرحلة ${pi + 1} — ${p.name}</span></div><div class="lstations">` +
    p.ls.map(l => {
      const st = l.file
        ? `<a class="lbtn" href="${l.file}">🚀 افتح الدرس</a><span class="lok" ${isVis(l.n) ? '' : 'hidden'}>✓ تمت زيارته</span>${l.n === newestN ? '<span class="lnew">جديد</span>' : ''}`
        : `<span class="llock">🔒 قريبًا</span>`;
      const meta = (l.ex ? ` · ${l.ex} تمرينًا` : '') + (l.min ? ` · ~${l.min} دقيقة` : '');
      return `<div class="lstation" id="ls${l.n}" data-n="${l.n}"><span class="lt"><span class="e">Lesson ${l.n} — ${l.en}</span></span><span class="la">الدرس ${l.n} — ${l.ar}</span><small>${l.desc || ''}${meta}</small><div class="lstatus">${st}</div></div>`;
    }).join('') + `</div>`
  ).join('');
}

/* ===== إحصاء التقدم + زر واصل (الرئيسية فقط) ===== */
function renderContinue() {
  const visited = AVAIL.filter(l => isVis(l.n));
  const stats = $('#courseStats');
  if (stats) stats.textContent = `✅ زرت ${visited.length} من ${AVAIL.length} درسًا متاحًا`;
  const btn = $('#continueBtn');
  if (!btn) return;
  const target = visited.length ? visited[visited.length - 1] : AVAIL[0];
  if (!target) return;
  btn.href = target.file;
  btn.innerHTML = `▶ واصل من حيث توقفت — Lesson ${target.n} — ${target.en}`;
}

/* ===== كارت الرحلة ديناميكيًا (كل الصفحات) ===== */
function renderJourney() {
  const host = $('#journeyBox');
  if (!host) return;
  const prev = L(curLesson - 1), next = L(curLesson + 1);
  let html = '';
  if (prev && prev.file) html += `<a class="jbtn" href="${prev.file}">→ الدرس السابق: Lesson ${prev.n}</a>`;
  else html += `<a class="jbtn" href="index.html">🏠 الرئيسية</a>`;
  html += `<a class="jbtn" href="index.html#roadmap">🗺 خريطة الرحلة</a>`;
  if (next && next.file) html += `<a class="jbtn" href="${next.file}">الدرس التالي: Lesson ${next.n} — ${next.en} ←</a>`;
  else if (next) html += `<a class="jbtn lock" href="index.html#ls${next.n}">الدرس التالي: Lesson ${next.n} 🔒</a>`;
  else html += `<a class="jbtn" href="index.html#roadmap">🏁 أنهيت كل المتاح حاليًا</a>`;
  host.innerHTML = html;
  renderLessonNav();
}

/* ===== شريط التنقل بين الدروس (مصحّح) ===== */
function renderLessonNav() {
  ensureLessonNav();
  const nav = $('.lesson-nav');
  if (!nav) return;
  const prev = L(curLesson - 1), next = L(curLesson + 1), cur = L(curLesson);
  const prevDone = prev ? isVis(prev.n) : false;
  const nextDone = next ? isVis(next.n) : false;
  let html = '';
  
  // زر السابق
  if (prev && prev.file) {
    html += `<a class="ln-btn prev" href="${prev.file}"><span class="ln-check ${prevDone ? 'done' : ''}">${prevDone ? '✓' : ''}</span>السابق</a>`;
  } else if (curLesson > 1) {
    html += `<a class="ln-btn prev disabled" href="#"><span class="ln-check"></span>السابق</a>`;
  } else {
    html += `<a class="ln-btn prev" href="index.html"><span class="ln-check"></span>الرئيسية</a>`;
  }
  
  // حبة الدرس الحالي
  if (cur) {
    html += `<div class="ln-pill"><span class="e">Lesson ${cur.n}</span><span class="ln-check ${isVis(cur.n) ? 'done' : ''}">${isVis(cur.n) ? '✓' : ''}</span></div>`;
  }
  
  // زر التالي (يظهر دائماً، معطل إذا لم يكن هناك ملف)
  if (next && next.file) {
    html += `<a class="ln-btn next" href="${next.file}">التالي<span class="ln-check ${nextDone ? 'done' : ''}">${nextDone ? '✓' : ''}</span></a>`;
  } else if (next) {
    html += `<a class="ln-btn next disabled" href="index.html#ls${next.n}">التالي<span class="ln-check"></span></a>`;
  } else {
    html += `<a class="ln-btn next disabled" href="index.html#roadmap">🏁<span class="ln-check"></span></a>`;
  }
  
  nav.innerHTML = html;
  showLessonNav();
}

function showLessonNav() {
  const nav = $('.lesson-nav');
  if (nav) nav.classList.add('show');
}

function ensureLessonNav() {
  if (!$('.lesson-nav')) {
    const nav = document.createElement('nav');
    nav.className = 'lesson-nav';
    nav.setAttribute('aria-label', 'التنقل بين الدروس');
    document.body.appendChild(nav);
  }
}

function ensureBottomTabs() {
  if (!$('.bottombar')) {
    const bar = document.createElement('nav');
    bar.className = 'bottombar glass';
    const isIndex = !!$('#roadmap');
    bar.innerHTML = `
      <div class="bb-nav"></div>
      <div class="bb-tabs">
        <a class="bb-tab" data-tab="home" href="index.html"><span class="i">🏠</span>الرئيسية</a>
        <a class="bb-tab" data-tab="map" href="index.html#roadmap"><span class="i">🗺️</span>الخريطة</a>
        <a class="bb-tab ${isIndex ? '' : 'active'}" data-tab="lesson" href="${isIndex ? '' : ('lesson' + curLesson + '.html')}"><span class="i">📖</span>الدرس</a>
        <a class="bb-tab" data-tab="toc" href="#"><span class="i">☰</span>الفهرس</a>
      </div>
    `;
    document.body.appendChild(bar);
  }
}

/* ومضة Highlight */
function flash(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 1900);
}

/* ===== الفهرس Drawer + Accordion ===== */
const toc = $('#toc');
const closeToc = () => {
  if (toc) toc.classList.remove('open');
  const b = $('#backdrop');
  if (b) b.classList.remove('show');
};
const mb = $('#menuBtn');
if (mb) {
  mb.onclick = () => {
    if (toc) toc.classList.toggle('open');
    const b = $('#backdrop');
    if (b) b.classList.toggle('show');
  };
}
const bd = $('#backdrop');
if (bd) bd.onclick = closeToc;

function openGrp(g) {
  if (!g) return;
  $$('.toc-grp').forEach(x => {
    if (x !== g) {
      x.classList.remove('open');
      const b = x.querySelector('.toc-gbody');
      if (b) b.style.maxHeight = '0px';
    }
  });
  g.classList.add('open');
  const b = g.querySelector('.toc-gbody');
  if (b) b.style.maxHeight = b.scrollHeight + 'px';
}

$$('.toc-ghead').forEach(h => h.onclick = () => {
  const grp = h.parentElement;
  if (grp.classList.contains('open')) {
    grp.classList.remove('open');
    const b = grp.querySelector('.toc-gbody');
    if (b) b.style.maxHeight = '0px';
  } else {
    openGrp(grp);
  }
});

$$('#toc a').forEach(a => a.addEventListener('click', () => {
  const href = a.getAttribute('href');
  if (href.startsWith('#')) {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $$('#toc a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    const grp = a.closest('.toc-grp');
    if (grp) openGrp(grp);
    closeToc();
  }
}));

/* تتبع القسم النشط */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const link = $$('#toc a').find(a => a.getAttribute('href') === '#' + e.target.id);
      if (link) {
        $$('#toc a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    }
  }), { rootMargin: '-35% 0px -55% 0px' });
  $$('section.card').forEach(s => io.observe(s));
}

/* ===== السكرول: تقدم + حلقة + شريط + fab + توست نهاية الدرس ===== */
const C = 2 * Math.PI * 18;
let endToastShown = false;
addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  const pr = $('#progress');
  if (pr) pr.style.width = (p * 100) + '%';
  const rf = $('#ringFg');
  if (rf) rf.style.strokeDashoffset = C - (C * p);
  const rt = $('#ringTxt');
  if (rt) rt.textContent = Math.round(p * 100) + '%';
  const tb = $('.topbar');
  if (tb) tb.classList.toggle('scrolled', h.scrollTop > 30);
  const fb = $('#topFab');
  if (fb) fb.classList.toggle('show', h.scrollTop > 500);
  
  if (curLesson > 0 && !endToastShown && h.scrollTop + h.clientHeight >= h.scrollHeight - 160) {
    endToastShown = true;
    const next = L(curLesson + 1);
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:86px;left:50%;transform:translateX(-50%);z-index:98;background:linear-gradient(135deg,#3a9b85,#5cb89e);color:#fff;padding:10px 22px;border-radius:999px;font-family:Cairo,Tahoma,sans-serif;font-weight:800;font-size:.85rem;box-shadow:0 8px 24px rgba(58,155,133,.45);white-space:nowrap;';
    t.innerHTML = (next && next.file)
      ? `🎉 أنهيت الدرس؟ <a href="${next.file}" style="color:#fff;text-decoration:underline">التالي: Lesson ${next.n}</a>`
      : `🏁 أنهيت كل المتاح حاليًا — تابع الخريطة`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 9000);
  }
}, { passive: true });

const tf = $('#topFab');
if (tf) tf.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
const prb = $('#printBtn');
if (prb) prb.onclick = () => print();
const mpb = $('#mapBtn');
if (mpb) mpb.onclick = () => {
  const el = document.getElementById('roadmap');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else location.href = 'index.html#roadmap';
};

/* ===== مزامنة الـhash ===== */
addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ===== اختصار كيبورد: Alt + ← / → للتنقل بين الدروس ===== */
addEventListener('keydown', e => {
  if (!e.altKey) return;
  if (e.key === 'ArrowLeft') {
    const n = L(curLesson + 1);
    if (n && n.file) location.href = n.file;
  }
  if (e.key === 'ArrowRight') {
    const p = L(curLesson - 1);
    if (p && p.file) location.href = p.file;
    else if (curLesson > 0) location.href = 'index.html';
  }
});

/* ===== طبقات تفاعلية ===== */
$$('.layer[data-goto]').forEach(l => l.onclick = () => {
  const el = document.querySelector(l.dataset.goto);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ===== تصحيح تفاعلي ===== */
function updateScore(quiz) {
  const qs = quiz.querySelectorAll('.q[data-correct]');
  const done = quiz.querySelectorAll('.q[data-correct].done').length;
  const sc = quiz.querySelector('.score');
  if (sc) sc.textContent = ` — النتيجة: ${done} / ${qs.length}`;
}

$$('.q[data-correct]').forEach(q => {
  q.querySelectorAll('.opts button').forEach(b => b.onclick = () => {
    if (q.classList.contains('done')) return;
    const fb = q.querySelector('.fb');
    fb.hidden = false;
    if (b.dataset.v === q.dataset.correct) {
      b.classList.add('ok');
      q.classList.add('done');
      fb.className = 'fb good';
      fb.textContent = '✅ إجابة صحيحة! ' + q.dataset.fb;
      updateScore(q.closest('.quiz'));
    } else {
      b.classList.add('no');
      setTimeout(() => b.classList.remove('no'), 600);
      fb.className = 'fb bad';
      fb.textContent = '❌ ليست الإجابة الدقيقة — حاول مجددًا!';
    }
  });
});

$$('.reset').forEach(r => r.onclick = e => {
  e.stopPropagation();
  const quiz = document.getElementById(r.dataset.target);
  if (!quiz) return;
  quiz.querySelectorAll('.q').forEach(q => {
    q.classList.remove('done');
    const f = q.querySelector('.fb');
    if (f) f.hidden = true;
  });
  quiz.querySelectorAll('.opts button').forEach(b => b.classList.remove('ok', 'no'));
  updateScore(quiz);
});

$$('.q > .rv:not(.reset)').forEach(b => b.onclick = e => {
  e.stopPropagation();
  const a = b.nextElementSibling;
  if (!a) return;
  a.hidden = !a.hidden;
  b.textContent = a.hidden ? '👁 أظهر الإجابة' : '🙈 أخفِ الإجابة';
});

/* ===== حفظ تلقائي ===== */
$$('textarea[data-save]').forEach(t => {
  const meta = t.nextElementSibling;
  if (!meta) return;
  const wc = meta.querySelector('.wc'), sav = meta.querySelector('.sav');
  t.value = localStorage.getItem(t.dataset.save) || '';
  const count = () => {
    if (wc) wc.textContent = t.value.trim() ? ('🔢 ' + t.value.trim().split(/\s+/).length + ' كلمة') : '';
  };
  count();
  let tm;
  t.addEventListener('input', () => {
    count();
    clearTimeout(tm);
    tm = setTimeout(() => {
      localStorage.setItem(t.dataset.save, t.value);
      if (sav) {
        sav.classList.add('on');
        setTimeout(() => sav.classList.remove('on'), 1500);
      }
    }, 400);
  });
});

const ra = $('#resetAll');
if (ra) ra.onclick = () => {
  if (!confirm('سيتم مسح جميع إجاباتك المحفوظة ونتائج التمارين وعلامات الزيارة. هل أنت متأكد؟')) return;
  Object.keys(localStorage).filter(k => /^l\d+ta-/.test(k) || /^l\d+vis$/.test(k)).forEach(k => localStorage.removeItem(k));
  $$('textarea[data-save]').forEach(t => {
    t.value = '';
    const m = t.nextElementSibling;
    if (m) {
      const w = m.querySelector('.wc');
      if (w) w.textContent = '';
    }
  });
  $$('.reset').forEach(r => r.click());
  refreshRegistry();
  renderRoadmap();
  renderContinue();
  renderJourney();
  updateTocProgress();
  scrollTo({ top: 0, behavior: 'smooth' });
  alert('تم المسح بنجاح ✅');
};

/* ===== حزمة الموبايل: سحب للتنقل بين الدروس + توفير طاقة ===== */
(function () {
  let sx = 0, sy = 0, tracking = false;
  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    const t = e.target;
    if (t.closest('#toc,.lesson-nav,.bottombar,.topbar,textarea,button,a,select,details,.stairs,.opts')) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });
  
  document.addEventListener('touchend', e => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) {
      if (dx < 0) {
        const n = L(curLesson + 1);
        if (n && n.file) location.href = n.file;
      } else {
        const p = L(curLesson - 1);
        if (p && p.file) location.href = p.file;
        else if (curLesson > 0) location.href = 'index.html';
      }
    }
  }, { passive: true });
})();

(function () {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const weak = (navigator.hardwareConcurrency || 4) <= 2;
  if (reduce || weak) {
    const bg = document.querySelector('.bg');
    if (bg) bg.style.display = 'none';
  }
})();

/* ===== PWA: تسجيل + تحديث تلقائي ===== */
function swToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#3a9b85,#5cb89e);color:#fff;padding:10px 24px;border-radius:999px;font-family:Cairo,Tahoma,sans-serif;font-weight:800;font-size:.85rem;z-index:99;box-shadow:0 8px 24px rgba(58,155,133,.45);white-space:nowrap;';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      setInterval(() => reg.update(), 5 * 60 * 1000);
    }).catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (sessionStorage.getItem('ewc-sw-reload')) return;
      sessionStorage.setItem('ewc-sw-reload', '1');
      swToast('✅ تم تحديث التطبيق — جارٍ تحميل النسخة الجديدة…');
      setTimeout(() => location.reload(), 1200);
    });
  });
}

/* ===== شريط التبويبات السفلي ===== */
(function () {
  ensureBottomTabs();
  const isIndex = !!$('#roadmap');
  $$('.bb-tab').forEach(t => {
    t.addEventListener('click', e => {
      const k = t.dataset.tab;
      if (k === 'toc') {
        e.preventDefault();
        const tc = $('#toc'), b2 = $('#backdrop');
        if (tc) {
          tc.classList.add('open');
          if (b2) b2.classList.add('show');
        }
        return;
      }
      if (k === 'map' && isIndex) {
        e.preventDefault();
        const el = $('#roadmap');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (k === 'home' && isIndex) {
        e.preventDefault();
        scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (k === 'lesson' && !isIndex) {
        e.preventDefault();
        scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    });
  });
})();

/* ===== البداية + إعادة رسم بعد تحميل كل السكربتات ===== */
(function init() {
  refreshRegistry();
  ensureLessonNav();
  ensureBottomTabs();
  renderRoadmap();
  renderContinue();
  renderJourney();
  updateTocProgress();
  
  const hash = location.hash.slice(1);
  const hel = hash && document.getElementById(hash);
  if (hel) {
    setTimeout(() => hel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    const link = $$('#toc a').find(a => a.getAttribute('href') === '#' + hash);
    if (link) {
      link.classList.add('active');
      const grp = link.closest('.toc-grp');
      if (grp) openGrp(grp);
    }
  }
  
  if (!$('.toc-grp.open')) {
    openGrp($('.toc-grp'));
  }
})();

window.addEventListener('load', () => {
  refreshRegistry();
  ensureLessonNav();
  ensureBottomTabs();
  renderRoadmap();
  renderContinue();
  renderJourney();
  updateTocProgress();
});