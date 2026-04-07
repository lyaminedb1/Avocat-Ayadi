/* ============================================
   CABINET MAÎTRE MANI AYADI — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Page Transition ───
  const overlay = document.querySelector('.page-overlay');
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('//')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      if (overlay) overlay.classList.add('out');
      setTimeout(() => window.location.href = href, 350);
    });
  });

  // ─── Navbar scroll ───
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Active nav link ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ─── Hamburger ───
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Scroll Reveal ───
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => obs.observe(el));
  }

  // ─── Counter animation ───
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const end = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.dec || 0);
        const dur = 1600;
        const steps = 60;
        const inc = end / steps;
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + inc, end);
          el.textContent = dec ? current.toFixed(dec) : Math.floor(current).toLocaleString('fr-FR');
          if (current >= end) clearInterval(timer);
        }, dur / steps);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  // ─── Form submit handler ───
  const form = document.querySelector('form.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const original = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      btn.style.background = '#4a7c59';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        form.reset();
      }, 3500);
    });
  }

  // ─── Domains sticky tabs (domaines.html) ───
  const domainTabs = document.querySelectorAll('.domain-tab');
  const domainSections = document.querySelectorAll('.domain-section');
  if (domainTabs.length && domainSections.length) {
    domainTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.domain;
        domainTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        domainSections.forEach(s => {
          s.classList.toggle('hidden', s.dataset.domain !== target && target !== 'all');
        });
        const first = document.querySelector(`.domain-section[data-domain="${target}"]`) || domainSections[0];
        if (first) {
          const offset = (navbar?.offsetHeight || 68) + 56 + 20;
          window.scrollTo({ top: first.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
      });
    });

    // Highlight tab on scroll
    const tabBar = document.querySelector('.domain-tabs');
    window.addEventListener('scroll', () => {
      const offset = (navbar?.offsetHeight || 68) + (tabBar?.offsetHeight || 52) + 30;
      let active = null;
      domainSections.forEach(s => {
        if (!s.classList.contains('hidden') && s.getBoundingClientRect().top <= offset + 40) {
          active = s.dataset.domain;
        }
      });
      if (active) domainTabs.forEach(t => t.classList.toggle('active', t.dataset.domain === active));
    }, { passive: true });
  }

});
