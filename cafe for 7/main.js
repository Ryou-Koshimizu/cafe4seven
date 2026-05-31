/**
 * Grains LP — main.js (GSAP + ScrollTrigger)
 */

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ============================================================
   ユーティリティ: .sh2 を <br> で行分割
============================================================ */
function splitH2(el) {
  const parts = el.innerHTML.split(/<br\s*\/?>/gi);
  el.innerHTML = parts
    .map(p => `<span class="hl"><span class="hl-inner">${p.trim()}</span></span>`)
    .join('');
  return el.querySelectorAll('.hl-inner');
}


/* ============================================================
   ヒーロータイムライン（イントロ完了後に呼ぶ）
============================================================ */
function playHero() {
  if (reduced) return;

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo('.hero__eyebrow',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1.0 }
    )
    .fromTo('.hero__h1 .hl',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.18, duration: 1.2, ease: 'power4.out' },
      '-=0.5'
    )
    .fromTo('.hero__sub',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.0 },
      '-=0.4'
    )
    .fromTo('.hero__actions',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9 },
      '-=0.5'
    )
    .fromTo('.hero__scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.3'
    );
}


/* ============================================================
   1. INTRO アニメーション
   ① 黒背景に "cafe Grains" 出現
   ② 白バーが左→右にスウィープ（文字を白く塗りつぶす）
   ③ 黒バーが追いかける（黒で塗りつぶす）
   ④ イントロ全体が上に退場 → ヒーローへ
============================================================ */
const introEl = document.getElementById('intro');

if (reduced) {
  introEl.style.display = 'none';
} else {
  document.body.style.overflow = 'hidden';

  gsap.timeline({
    onComplete() {
      document.body.style.overflow = '';
      introEl.style.display = 'none';
      playHero();
    }
  })
    // タイトル出現
    .fromTo('#intro__title',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
    )
    // 少し保持
    .to({}, { duration: 0.8 })
    // 白バーが左→右にスウィープ
    .fromTo('#intro__sweep-white',
      { xPercent: -101 },
      { xPercent: 101, duration: 0.85, ease: 'power2.inOut' }
    )
    // 黒バーが追いかける（0.5s 遅れで重ねる）
    .fromTo('#intro__sweep-black',
      { xPercent: -101 },
      { xPercent: 101, duration: 0.85, ease: 'power2.inOut' },
      '-=0.5'
    )
    // イントロ全体が上へ退場
    .to('#intro', {
      yPercent: -100,
      duration: 1.1,
      ease: 'power3.inOut',
    }, '+=0.1');
}


/* ============================================================
   2. NAV — スクロールで border を表示
============================================================ */
const nav = document.getElementById('mainNav');

ScrollTrigger.create({
  start: 'top -40',
  onEnter:     () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled'),
});


/* ============================================================
   3. HERO PARALLAX — scrub: true でスクロールに完全連動
============================================================ */
if (!reduced) {
  gsap.to('#heroBg', {
    yPercent: 28,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}


/* ============================================================
   4. セクション見出し (.sh2) — 行ごとにせり上がる
============================================================ */
document.querySelectorAll('.sh2').forEach(el => {
  const lines = splitH2(el);

  if (reduced) {
    gsap.set(lines, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(lines,
    { y: 80, opacity: 0 },
    {
      y: 0, opacity: 1,
      stagger: 0.15, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }
  );
});


/* ============================================================
   5. KICKER — 左からスライドイン
============================================================ */
document.querySelectorAll('.kicker').forEach(el => {
  if (reduced) { gsap.set(el, { opacity: 1, x: 0 }); return; }

  gsap.fromTo(el,
    { opacity: 0, x: -36 },
    {
      opacity: 1, x: 0,
      duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    }
  );
});


/* ============================================================
   6. REVEAL — フェードアップ（方向指定対応）
============================================================ */
document.querySelectorAll('.reveal').forEach(el => {
  if (reduced) { gsap.set(el, { opacity: 1, x: 0, y: 0 }); return; }

  const fromX = el.classList.contains('from-left')  ? -48
              : el.classList.contains('from-right') ?  48 : 0;
  const fromY = fromX === 0 ? 48 : 0;

  gsap.fromTo(el,
    { opacity: 0, x: fromX, y: fromY },
    {
      opacity: 1, x: 0, y: 0,
      duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }
  );
});


/* ============================================================
   7. CARDS STAGGER — カードが時差でせり上がる
============================================================ */
if (!reduced) {
  document.querySelectorAll('section, .mid-cta').forEach(section => {
    const cards = section.querySelectorAll('.fcard, .mcard, .vcard, .titem');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 56 },
      {
        opacity: 1, y: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: cards[0], start: 'top 88%' },
      }
    );
  });
}


/* ============================================================
   8. ABOUT PHOTO — clip-path リビール + パラレルスクロール
============================================================ */
if (!reduced) {
  gsap.fromTo('.about__photo-wrap',
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.6, ease: 'power4.inOut',
      scrollTrigger: { trigger: '.about__photo-wrap', start: 'top 80%' },
    }
  );

  gsap.to('#aboutParallax', {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about__photo-wrap',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}


/* ============================================================
   9. COUNT UP — 数字がカウントアップ
============================================================ */
document.querySelectorAll('.count').forEach(el => {
  const to  = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.dec || '0');
  const obj = { val: 0 };

  gsap.to(obj, {
    val: to,
    duration: 2.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
    onUpdate()  { el.textContent = dec ? obj.val.toFixed(dec) : Math.floor(obj.val); },
    onComplete(){ el.textContent = dec ? to.toFixed(dec) : String(to); },
  });
});


/* ============================================================
   10. スムーズアンカースクロール
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
