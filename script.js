/* ====================================================
   script.js — Portfolio Interactions
   ==================================================== */

'use strict';

// ─── Utility ───────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── Custom Cursor ─────────────────────────────────────────
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state for interactive elements
  const hoverTargets = 'a, button, .project-card, .skill-card, .like-item, .btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    }
  });

  // Hide on leave, show on enter
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();

// ─── Navbar scroll effect ───────────────────────────────────
(function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── Mobile menu ───────────────────────────────────────────
(function initMobileMenu() {
  const btn   = $('#menuBtn');
  const links = $('#navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    links.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close on link click
  $$('.nav-link', links).forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ─── Hero role cycler ──────────────────────────────────────
(function initRoleCycler() {
  const roles = $$('.role-item');
  const wrap  = $('#heroRoles');
  if (!roles.length || !wrap) return;

  let current = 0;
  const DURATION = 2400; // ms per role

  function next() {
    roles[current].classList.remove('active');
    current = (current + 1) % roles.length;
    roles[current].classList.add('active');
    wrap.style.transform = `translateY(-${current * 4.5}rem)`;
  }

  setInterval(next, DURATION);
})();

// ─── Scroll Reveal ─────────────────────────────────────────
(function initScrollReveal() {
  const reveals = $$('.reveal');
  if (!reveals.length) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => obs.observe(el));
})();

// ─── Parallax hero text ────────────────────────────────────
(function initHeroParallax() {
  const heroLeft  = $('.hero-left');
  const heroRight = $('.hero-right');
  const grid      = $('.hero-bg-grid');
  if (!heroLeft) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroLeft.style.transform  = `translateY(${y * 0.18}px)`;
        if (heroRight) heroRight.style.transform = `translateY(${y * 0.10}px)`;
        if (grid) grid.style.transform = `translateY(${y * 0.06}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ─── Smooth active nav highlight ───────────────────────────
(function initNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--text)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => obs.observe(s));
})();

// ─── Project card tilt (subtle) ────────────────────────────
(function initTilt() {
  const cards = $$('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 2}deg) rotateX(${-dy * 2}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s var(--ease-out), background 0.3s';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s, background 0.3s';
    });
  });
})();

// ─── Easter egg: Konami code → One Piece 🏴‍☠️ ──────────────
(function initKonami() {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let seq = [];

  document.addEventListener('keydown', e => {
    seq.push(e.key);
    if (seq.length > KONAMI.length) seq.shift();
    if (seq.join('') === KONAMI.join('')) {
      showPirateToast();
      seq = [];
    }
  });

  function showPirateToast() {
    const toast = document.createElement('div');
    toast.textContent = '🏴‍☠️ You found the hidden treasure! The One Piece is real! ⚓';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: '#f0f0f0',
      color: '#0a0a0a',
      padding: '1rem 2rem',
      borderRadius: '50px',
      fontFamily: "'DM Mono', monospace",
      fontSize: '0.85rem',
      fontWeight: '500',
      zIndex: '99999',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      opacity: '0',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      maxWidth: '90vw',
      textAlign: 'center',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
})();
