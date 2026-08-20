/* =================================================================
   APAE Américo Brasiliense — main.js
   ================================================================= */

/* -----------------------------------------------------------------
   1. HEADER: shadow on scroll
   ----------------------------------------------------------------- */
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* -----------------------------------------------------------------
   2. HAMBURGER — mobile menu open/close
   ----------------------------------------------------------------- */
(function () {
  var btn  = document.getElementById('hamburger-btn');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  /* Close on ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      btn.focus();
    }
  });

  /* Close when a nav link is tapped */
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();


/* -----------------------------------------------------------------
   3. DESKTOP DROPDOWN — Transparência
   ----------------------------------------------------------------- */
(function () {
  var items = document.querySelectorAll('.nav-item--dropdown');
  if (!items.length) return;

  function closeAll() {
    items.forEach(function (item) {
      item.classList.remove('is-open');
      var t = item.querySelector('.nav-dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('.nav-dropdown-trigger');
    var links   = Array.prototype.slice.call(item.querySelectorAll('.dropdown-link'));
    var timer;

    if (!trigger) return;

    /* Hover: open immediately, close with small delay */
    item.addEventListener('mouseenter', function () {
      clearTimeout(timer);
      closeAll();
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', function () {
      timer = setTimeout(function () {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 120);
    });

    /* Click: toggle (keyboard + touch) */
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = item.classList.contains('is-open');
      closeAll();
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    /* Keyboard: Enter/Space opens and focuses first item */
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var isOpen = item.classList.contains('is-open');
        closeAll();
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          if (links[0]) links[0].focus();
        }
      }
      if (e.key === 'Escape') {
        closeAll();
        trigger.focus();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        if (links[0]) links[0].focus();
      }
    });

    /* Arrow navigation inside dropdown */
    links.forEach(function (link, i) {
      link.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); if (links[i + 1]) links[i + 1].focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); if (links[i - 1]) links[i - 1].focus(); else trigger.focus(); }
        if (e.key === 'Escape')    { closeAll(); trigger.focus(); }
        if (e.key === 'Tab' && !e.shiftKey && i === links.length - 1) { closeAll(); }
      });
    });
  });

  /* Click outside → close */
  document.addEventListener('click', closeAll);
})();


/* -----------------------------------------------------------------
   4. MOBILE ACCORDION — Transparência sub-items
   ----------------------------------------------------------------- */
(function () {
  var items = document.querySelectorAll('.mobile-nav-item--expandable');

  items.forEach(function (item) {
    var btn = item.querySelector('.mobile-nav-accordion');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();


/* -----------------------------------------------------------------
   5. SCROLL REVEAL — fade + translateY via IntersectionObserver
      (Sections added later will auto-animate via [data-reveal])
   ----------------------------------------------------------------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var style = document.createElement('style');
  style.textContent =
    '[data-reveal]{opacity:0;transform:translateY(20px);transition:opacity 500ms ease,transform 500ms ease;}' +
    '[data-reveal].revealed{opacity:1;transform:none;}';
  document.head.appendChild(style);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
})();


/* -----------------------------------------------------------------
   6. COUNTER ANIMATION — .impacto-num[data-target] on scroll entry
   ----------------------------------------------------------------- */
(function () {
  var counters = document.querySelectorAll('.impacto-num[data-target]');
  if (!counters.length) return;

  var duration = 1500;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var start  = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = prefix + Math.round(easeOut(progress) * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target;
      }
    }

    requestAnimationFrame(step);
  }

  /* Fallback: no IntersectionObserver or reduced-motion */
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-target');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (el) { observer.observe(el); });
})();


/* -----------------------------------------------------------------
   7. FAQ ACCORDION — .faq-item / .faq-btn / .faq-answer
   ----------------------------------------------------------------- */
(function () {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn    = item.querySelector('.faq-btn');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      /* Close all siblings */
      items.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          var ob = other.querySelector('.faq-btn');
          var oa = other.querySelector('.faq-answer');
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (oa) oa.hidden = true;
        }
      });

      /* Toggle this item */
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
})();


/* -----------------------------------------------------------------
   8. TRANSPARENCY — year filter for document tables
   ----------------------------------------------------------------- */
(function () {
  var filters = document.querySelectorAll('.tp-year-filter');
  if (!filters.length) return;

  filters.forEach(function (filter) {
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('.tp-year-btn');
      if (!btn) return;
      var section = filter.closest('.tp-doc-section');
      var year = btn.dataset.year;
      filter.querySelectorAll('.tp-year-btn').forEach(function (b) {
        b.classList.remove('tp-year-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('tp-year-btn--active');
      btn.setAttribute('aria-pressed', 'true');
      section.querySelectorAll('tbody tr').forEach(function (row) {
        row.hidden = year !== 'all' && row.dataset.year !== year;
      });
    });
  });
})();


/* -----------------------------------------------------------------
   9. LIGHTBOX — photo zoom for .gp-cell (home) and .gv-photo-cell (fotos-videos)
   ----------------------------------------------------------------- */
(function () {
  var cells = Array.prototype.slice.call(
    document.querySelectorAll('.gp-cell, .gv-photo-cell')
  ).filter(function (cell) { return !!cell.querySelector('img'); });

  if (!cells.length) return;

  var images = cells.map(function (cell) {
    var img = cell.querySelector('img');
    return { src: img.src, alt: img.alt || '' };
  });

  var current = 0;
  var lb, lbImg, lbCaption, lbCounter, lbClose, lbPrev, lbNext;
  var lastFocused;

  /* Build and inject lightbox DOM once */
  lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Visualizar foto ampliada');
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML =
    '<button class="lightbox__close" aria-label="Fechar lightbox">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">' +
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
      '</svg>' +
    '</button>' +
    '<button class="lightbox__nav lightbox__prev" aria-label="Foto anterior">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">' +
        '<polyline points="15 18 9 12 15 6"/>' +
      '</svg>' +
    '</button>' +
    '<div class="lightbox__inner">' +
      '<img class="lightbox__img" src="" alt="">' +
    '</div>' +
    '<button class="lightbox__nav lightbox__next" aria-label="Próxima foto">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">' +
        '<polyline points="9 18 15 12 9 6"/>' +
      '</svg>' +
    '</button>' +
    '<p class="lightbox__caption" aria-live="polite"></p>' +
    '<p class="lightbox__counter" aria-live="polite"></p>';
  document.body.appendChild(lb);

  lbImg     = lb.querySelector('.lightbox__img');
  lbCaption = lb.querySelector('.lightbox__caption');
  lbCounter = lb.querySelector('.lightbox__counter');
  lbClose   = lb.querySelector('.lightbox__close');
  lbPrev    = lb.querySelector('.lightbox__prev');
  lbNext    = lb.querySelector('.lightbox__next');

  function show(index) {
    current = (index + images.length) % images.length;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    lbCaption.textContent = images[current].alt;
    lbCounter.textContent = (current + 1) + ' / ' + images.length;
    if (images.length === 1) {
      lb.setAttribute('data-single', '');
    } else {
      lb.removeAttribute('data-single');
    }
  }

  function openLB(index) {
    lastFocused = document.activeElement;
    show(index);
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLB() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
    setTimeout(function () { if (!lb.classList.contains('is-open')) lbImg.src = ''; }, 280);
  }

  lbClose.addEventListener('click', closeLB);
  lbPrev.addEventListener('click', function () { show(current - 1); });
  lbNext.addEventListener('click', function () { show(current + 1); });

  /* Click on backdrop (not inner content) */
  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLB();
  });

  /* Keyboard: ESC, arrows */
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')     { closeLB(); }
    if (e.key === 'ArrowLeft')  { show(current - 1); }
    if (e.key === 'ArrowRight') { show(current + 1); }
  });

  /* Wire cells: click + keyboard */
  cells.forEach(function (cell, i) {
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', 'Ampliar foto: ' + (images[i].alt || 'imagem ' + (i + 1)));
    cell.addEventListener('click', function () { openLB(i); });
    cell.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(i); }
    });
  });
})();


/* -----------------------------------------------------------------
   Auto-update copyright year in footer across all pages
   ----------------------------------------------------------------- */
(function () {
  var el = document.querySelector('.footer-copyright');
  if (!el) return;
  el.innerHTML = el.innerHTML.replace(/\d{4}/, new Date().getFullYear());
})();


/* -----------------------------------------------------------------
   10. GA4 ANALYTICS — conversion event tracking via event delegation
   ----------------------------------------------------------------- */
(function () {
  document.addEventListener('DOMContentLoaded', function () {

    /* Click delegation: WhatsApp, Doação, PDF, Telefone */
    document.addEventListener('click', function (e) {
      if (typeof gtag !== 'function') return;

      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href') || '';
      var cls  = link.className        || '';

      /* whatsapp_click */
      if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
        var waLocal = 'outro';
        if      (cls.indexOf('whatsapp-float') !== -1) waLocal = 'float';
        else if (cls.indexOf('loc-link')       !== -1) waLocal = 'localizacao';
        gtag('event', 'whatsapp_click', { local: waLocal });
        return;
      }

      /* doar_click */
      if (href === '/doe-agora' || cls.indexOf('btn-donate') !== -1) {
        var doarLocal = cls.indexOf('hero') !== -1 ? 'hero' : 'outro';
        gtag('event', 'doar_click', { local: doarLocal });
        return;
      }

      /* pdf_transparencia_click */
      if (/\.pdf$/i.test(href)) {
        var arquivo = href.split('/').pop();
        gtag('event', 'pdf_transparencia_click', { arquivo: arquivo });
        return;
      }

      /* telefone_click */
      if (href.indexOf('tel:') === 0) {
        gtag('event', 'telefone_click');
        return;
      }
    });

    /* formulario_enviado */
    document.addEventListener('submit', function () {
      if (typeof gtag !== 'function') return;
      gtag('event', 'formulario_enviado');
    });

  });
})();
