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

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
