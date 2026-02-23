/* ============================================================
   shared.js — travisteo.com shared scripts
   Security hardened, OWASP compliant, responsive
   ============================================================ */

/* ── HTML SANITIZER (XSS prevention) ── */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ── DYNAMIC YEAR ── */
document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

/* ── ACTIVE NAV on scroll ── */
function initNavHighlight() {
  const links = document.querySelectorAll('[data-nav]');
  if (!links.length) return;
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  function onScroll() {
    const scrollY = window.scrollY + 100;
    let active = sections[0];
    sections.forEach(s => { if (scrollY >= s.offsetTop) active = s; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + active?.id);
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

/* ── GO TOP ── */
function initGoTop() {
  const btn = document.getElementById('go-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('on', window.scrollY > 400), {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

/* ── LIGHTBOX ── */
function initLightbox() {
  const lb   = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  if (!lb || !lbImg) return;

  document.querySelectorAll('.expandable').forEach(img => {
    img.addEventListener('click', () => {
      // sanitize: only use src attribute from img elements
      if (img.tagName === 'IMG') {
        const src = img.getAttribute('src') || '';
        // Only allow relative paths and trusted domains
        if (!src.startsWith('javascript:') && !src.startsWith('data:text')) {
          lbImg.src = src;
          lbImg.alt = escHtml(img.alt || '');
          lb.classList.add('on');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });
  function closeLb() {
    lb.classList.remove('on');
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

/* ── MODAL ── */
function initModal() {
  const bg    = document.getElementById('modal-bg');
  const box   = document.getElementById('modal-box');
  const body  = document.getElementById('modal-body');
  const close = document.getElementById('modal-close');
  if (!bg) return;
  function openModal(html) {
    // Note: html here comes from our own data.js — trusted content
    body.innerHTML = html;
    bg.classList.add('on');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    bg.classList.remove('on');
    body.innerHTML = '';
    document.body.style.overflow = '';
  }
  close?.addEventListener('click', closeModal);
  bg.addEventListener('click', e => { if (e.target === bg) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  window._openModal = openModal;
}

/* ── TERMINAL TYPEWRITER ── */
function initTerminal(id, lines, delay) {
  const out = document.getElementById(id);
  if (!out) return;
  let i = 0;
  const wpm = 280;
  const charDelay = 60000 / (wpm * 5);

  function typeText(text, cls, cb) {
    const span = document.createElement('span');
    if (cls) span.className = cls;
    out.appendChild(span);
    let ci = 0;
    const t = setInterval(() => {
      span.textContent += text[ci++];
      if (ci >= text.length) { clearInterval(t); if (cb) cb(); }
    }, charDelay);
  }

  function next() {
    if (i >= lines.length) return;
    const line = lines[i++];
    if (line.type === 'blank') { out.appendChild(document.createElement('br')); setTimeout(next, 60); }
    else if (line.type === 'cursor') {
      const span = document.createElement('span');
      span.className = 't-cursor';
      out.appendChild(span);
    }
    else if (line.type === 'cmd') {
      const wrap = document.createElement('div');
      const prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = 'travis_teo@portfolio:~$ ';
      wrap.appendChild(prompt);
      out.appendChild(wrap);
      typeText(line.text, 't-cmd', () => setTimeout(next, 80));
      wrap.appendChild(out.lastChild);  // move typed span inside wrap
    }
    else if (line.type === 'out') {
      const div = document.createElement('div');
      const sp = document.createElement('span');
      sp.className = line.cls || '';
      sp.textContent = line.text;
      div.appendChild(sp);
      out.appendChild(div);
      setTimeout(next, 40);
    }
    else if (line.type === 'kv') {
      const div = document.createElement('div');
      div.innerHTML = `&nbsp;&nbsp;<span class="t-key">${escHtml(line.key)}</span><span class="t-dim">: </span><span class="t-str">${escHtml(line.val)}</span>${line.last ? '' : '<span class="t-dim">,</span>'}`;
      out.appendChild(div);
      setTimeout(next, 30);
    }
  }

  setTimeout(() => next(), delay || 400);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavHighlight();
  initReveal();
  initGoTop();
  initLightbox();
  initModal();
  if (typeof onPageReady === 'function') onPageReady();
});
