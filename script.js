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
