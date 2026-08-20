'use strict';

/* ── Navbar: transparent → frosted on scroll ── */
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile menu toggle ── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

/* Close mobile menu when clicking outside */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ── Fade-in on scroll (IntersectionObserver) ── */
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger children of a group */
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80; // max 240ms stagger per viewport
  fadeObserver.observe(el);
});

/* ── Active nav link on section entry ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('header .nav-link');

const activeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach(s => activeObserver.observe(s));

/* ── Smooth scroll for anchor links (Safari fallback) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY
               - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Hide scroll cue after first scroll ── */
const scrollCue = document.querySelector('.scroll-cue');
if (scrollCue) {
  const hideCue = () => {
    if (window.scrollY > 80) {
      scrollCue.style.opacity = '0';
      scrollCue.style.pointerEvents = 'none';
      window.removeEventListener('scroll', hideCue);
    }
  };
  window.addEventListener('scroll', hideCue, { passive: true });
}
