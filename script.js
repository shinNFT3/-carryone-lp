/* ============================================================
   CarryONE LP - script.js
   ============================================================ */

(function () {
  'use strict';

  /* ===== STICKY HEADER (Always Visible) ===== */
  const header = document.getElementById('stickyHeader');
  // Scroll visibility logic removed as per request to keep it always out

  /* ===== HAMBURGER MENU ===== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      if (hamburgerBtn.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== FLOAT CTA ===== */
  const floatCta = document.getElementById('floatCta');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      floatCta.classList.add('visible');
    } else {
      floatCta.classList.remove('visible');
    }
  }, { passive: true });

  /* ===== SCROLL ANIMATIONS ===== */
  const animElements = document.querySelectorAll(
    '.worry-card, .reason-card, .price-card, .service-card, .flow-step, ' +
    '.voice-card, .faq-item, .city-chip, .price-single'
  );
  animElements.forEach((el) => el.classList.add('animate-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, (i % 6) * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animElements.forEach((el) => observer.observe(el));

  /* ===== SECTION HEADER ANIMATIONS ===== */
  const sectionHeaders = document.querySelectorAll('.section-title, .section-label');
  sectionHeaders.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  sectionHeaders.forEach((el) => sectionObserver.observe(el));

  /* ===== FAQ ACCORDION ===== */
  window.toggleFaq = function (id) {
    const item = document.getElementById(id);
    if (!item) return;
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('open'));
    // toggle target
    if (!isOpen) item.classList.add('open');
  };

  /* ===== SMOOTH SCROLL for #links ===== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ===== FORM SUBMIT (AJAX to FormSubmit) ===== */
  window.handleSubmit = function (e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const btn = document.getElementById('submitBtn');

    btn.textContent = '送信中...';
    btn.disabled = true;

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      form.style.display = 'none';
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(error => {
      alert('送信に失敗しました。しばらく経ってから再度お試しください。');
      btn.textContent = '無料見積りを申込む（完全無料）';
      btn.disabled = false;
    });
  };

  /* ===== NUMBER COUNTER ANIMATION ===== */
  function animateCounter(el, target, duration, smallHTML) {
    let start = 0;
    const step = target / (duration / 16);
    const useFloat = target % 1 !== 0;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      const val = useFloat ? start.toFixed(1) : Math.floor(start).toLocaleString('ja-JP');
      el.innerHTML = val + (smallHTML || '');
    }, 16);
  }

  const trustNums = document.querySelectorAll('.trust-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const smallNode = el.querySelector('small');
        const smallHTML = smallNode ? smallNode.outerHTML : '';
        const textToParse = el.textContent.replace(/,/g, '');
        const match = textToParse.match(/([0-9.]+)/);
        
        if (match) {
          const num = parseFloat(match[1]);
          animateCounter(el, num, 1200, smallHTML);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  trustNums.forEach((el) => counterObserver.observe(el));

  /* ===== CITY CHIP HOVER EFFECT ===== */
  document.querySelectorAll('.city-chip').forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      chip.style.transition = 'all 0.2s';
    });
  });

  /* ===== ACTIVE NAV STATE (optional) ===== */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        // could highlight nav link if needed
      }
    });
  }, { passive: true });

  console.log('✅ CarryONE LP 神奈川全域版 initialized');
})();
