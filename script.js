// Header becomes solid after scrolling past the top
const header = document.querySelector('.site-header');
if (header && !header.classList.contains('always')) {
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    header.classList.add('solid');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }));
}

// Videos load only after a click (no data goes to YouTube/Vimeo before that)
document.querySelectorAll('.video button').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = btn.parentElement;
    const { yt, vimeo } = box.dataset;
    const src = yt
      ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${vimeo}?autoplay=1&dnt=1`;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = btn.querySelector('b').textContent;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    box.replaceChildren(iframe);
  });
});

// Fade sections in as they scroll into view
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Language switch DE / EN (default: browser language, choice is remembered)
(function () {
  const titles = {
    de: document.title,
    en: 'Kai Mäder – Sound Engineer · Live Sound · Recording · Sound Design'
  };
  const els = [...document.querySelectorAll('[data-en]')];
  els.forEach(el => { el.dataset.de = el.innerHTML; });
  function setLang(lang) {
    els.forEach(el => { el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.de; });
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    document.title = titles[lang];
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }
  let lang = 'de';
  try { lang = localStorage.getItem('lang') || ((navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en'); } catch (e) {}
  setLang(lang);
  const btn = document.querySelector('.lang-toggle');
  if (btn) btn.addEventListener('click', () => setLang(document.documentElement.lang === 'de' ? 'en' : 'de'));
})();

// Fotos der FWL-Collage beim Anklicken groß anzeigen (Lightbox)
(function () {
  const imgs = [...document.querySelectorAll('.fwl-collage img')];
  if (!imgs.length) return;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lb-close" aria-label="Schließen">×</button>' +
    '<button class="lb-prev" aria-label="Vorheriges Foto">‹</button>' +
    '<img alt=""><button class="lb-next" aria-label="Nächstes Foto">›</button>';
  document.body.appendChild(box);
  const big = box.querySelector('img');
  let i = 0;
  function show(n) {
    i = (n + imgs.length) % imgs.length;
    big.src = imgs[i].currentSrc || imgs[i].src;
    big.alt = imgs[i].alt;
  }
  function open(n) { show(n); box.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
  imgs.forEach((img, n) => {
    img.tabIndex = 0;
    img.addEventListener('click', () => open(n));
    img.addEventListener('keydown', e => { if (e.key === 'Enter') open(n); });
  });
  box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lb-close')) close(); });
  box.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(i - 1); });
  box.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(i + 1); });
  big.addEventListener('click', e => { e.stopPropagation(); show(i + 1); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
})();
