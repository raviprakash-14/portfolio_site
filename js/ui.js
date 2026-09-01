/* =============================================================
   UI BEHAVIOUR
   -------------------------------------------------------------
   Loader, custom cursor, mobile navigation, scroll spy, reveal
   animations, 3D card tilt, and the keyboard easter egg.

   Everything in here is progressive enhancement: if this file
   fails to load, the page is still fully readable and every link
   still works.
   ============================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- LOADER ---------- */
  (function loader() {
    var el = document.getElementById('loader');
    var bar = document.getElementById('loader-bar');
    var pctEl = document.getElementById('loader-pct');
    if (!el) return;

    function finish() {
      if (bar) bar.style.width = '100%';
      if (pctEl) pctEl.textContent = '100%';
      el.classList.add('hidden');
      document.documentElement.classList.add('js-ready');
      /* Remove from the tab order once it is invisible */
      window.setTimeout(function () { el.setAttribute('hidden', ''); }, 800);
    }

    if (reduceMotion) { finish(); return; }

    var pct = 0;
    var timer = window.setInterval(function () {
      pct = Math.min(100, pct + Math.random() * 18);
      if (bar) bar.style.width = pct + '%';
      if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
      if (pct >= 100) {
        window.clearInterval(timer);
        window.setTimeout(finish, 250);
      }
    }, 110);

    /* Hard safety net: the loader can never trap the visitor, even
       if a timer is throttled or an asset stalls. */
    window.setTimeout(function () {
      window.clearInterval(timer);
      finish();
    }, 4000);
  })();

  /* ---------- CUSTOM CURSOR ---------- */
  (function cursor() {
    if (!finePointer || reduceMotion) return;

    var dot = document.getElementById('cursor');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.documentElement.classList.add('custom-cursor');

    var x = 0, y = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
    }, { passive: true });

    (function follow() {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();

    /* Delegated so it also covers cards rendered later by render.js */
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,input,textarea,.project-card,.skill-node')) {
        dot.classList.add('active');
        ring.classList.add('active');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a,button,input,textarea,.project-card,.skill-node')) {
        dot.classList.remove('active');
        ring.classList.remove('active');
      }
    });
  })();

  /* ---------- MOBILE NAVIGATION ---------- */
  (function nav() {
    var toggle = document.querySelector('.nav-toggle');
    var list = document.getElementById('nav-links');
    if (!toggle || !list) return;

    function close() {
      list.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      list.classList.toggle('open', !open);
      toggle.setAttribute('aria-expanded', String(!open));
    });

    /* Tapping a link, pressing Escape or resizing to desktop all
       dismiss the menu so it can never cover the content. */
    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('open')) {
        close();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) close();
    }, { passive: true });
  })();

  /* ---------- SCROLL PROGRESS + STICKY NAV + SCROLL SPY ---------- */
  (function scrollUi() {
    var progress = document.getElementById('scroll-progress');
    var header = document.querySelector('.site-nav');
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var ticking = false;

    function update() {
      ticking = false;

      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      if (header) header.classList.toggle('scrolled', window.scrollY > 40);

      /* Highlight whichever section owns the upper third of the view */
      var marker = window.scrollY + window.innerHeight * 0.32;
      var currentId = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= marker) currentId = s.id;
      });
      links.forEach(function (a) {
        var isCurrent = currentId && a.getAttribute('href') === '#' + currentId;
        if (isCurrent) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    /* rAF throttle keeps the scroll handler off the critical path */
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });

    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* ---------- REVEAL ON SCROLL ---------- */
  function observeReveals() {
    var items = document.querySelectorAll('.reveal:not(.visible), .timeline-item:not(.visible)');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      /* No observer, no animation - show everything immediately
         rather than risk content that never appears. */
      Array.prototype.forEach.call(items, function (el) { el.classList.add('visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------- 3D CARD TILT ---------- */
  /* Every boxed surface leans toward the pointer and lifts a little,
     so the whole page reacts to the cursor the same way. Add a
     selector here and it inherits the behaviour - nothing else to do.

       tilt     degrees of lean at the very edge of the box
       lift     px the box rises while hovered
       parallax px of counter-movement for media inside it */
  var TILT_TARGETS = [
    { selector: '.project-card', tilt: 7, lift: 6, parallax: 10 },
    { selector: '.info-item',    tilt: 7, lift: 5 },
    { selector: '.contact-card', tilt: 7, lift: 5 },
    { selector: '.tag',          tilt: 7, lift: 3 },
    { selector: '.skill-node',   tilt: 7, lift: 3 }
  ];

  function bindTilt(box, opt) {
    if (box.dataset.tiltBound) return;
    box.dataset.tiltBound = '1';

    var frame = null;

    box.addEventListener('mousemove', function (e) {
      /* One write per frame; mousemove fires far faster than paint */
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var rect = box.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;   /* 0..1 */
        var py = (e.clientY - rect.top) / rect.height;   /* 0..1 */

        box.style.transform =
          'perspective(1000px) rotateY(' + ((px - 0.5) * opt.tilt * 2) + 'deg) ' +
          'rotateX(' + ((0.5 - py) * opt.tilt * 2) + 'deg) ' +
          'translateY(-' + opt.lift + 'px)';

        /* Feeds the CSS radial sheen and any media parallax */
        box.style.setProperty('--mx', (px * 100) + '%');
        box.style.setProperty('--my', (py * 100) + '%');
        if (opt.parallax) {
          box.style.setProperty('--px', ((0.5 - px) * opt.parallax) + 'px');
          box.style.setProperty('--py', ((0.5 - py) * opt.parallax) + 'px');
        }
      });
    });

    box.addEventListener('mouseleave', function () {
      /* Drop any queued frame so it cannot re-tilt after the reset */
      if (frame) { cancelAnimationFrame(frame); frame = null; }
      box.style.transform = '';
      box.style.setProperty('--px', '0px');
      box.style.setProperty('--py', '0px');
    });
  }

  function initTilt() {
    if (!finePointer || reduceMotion) return;

    TILT_TARGETS.forEach(function (target) {
      document.querySelectorAll(target.selector).forEach(function (box) {
        bindTilt(box, target);
      });
    });
  }

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  (function anchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

      /* Move keyboard focus with the view, not just the scrollbar */
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      if (history.replaceState) history.replaceState(null, '', hash);
    });
  })();

  /* ---------- EASTER EGG ---------- */
  (function easterEgg() {
    var SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var index = 0;
    var badge = document.getElementById('egg-badge');

    document.addEventListener('keydown', function (e) {
      /* Never hijack typing inside the contact form */
      if (e.target.matches('input, textarea')) return;

      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      index = key === SEQUENCE[index] ? index + 1 : (key === SEQUENCE[0] ? 1 : 0);

      if (index === SEQUENCE.length) {
        index = 0;
        document.dispatchEvent(new CustomEvent('portfolio:boost'));
        if (badge) {
          badge.textContent = 'Hyperdrive engaged - thanks for exploring';
          badge.classList.add('show');
          window.setTimeout(function () { badge.classList.remove('show'); }, 3200);
        }
      }
    });
  })();

  /* ---------- WIRE UP ---------- */
  function enhance() {
    observeReveals();
    initTilt();
  }

  /* render.js fires this once the data-driven sections exist. */
  document.addEventListener('portfolio:rendered', enhance);
  enhance();

  /* Safety net for the entrance animation in case the loader never
     ran (script error, or the element was removed). */
  window.setTimeout(function () {
    document.documentElement.classList.add('js-ready');
  }, 100);
})();
