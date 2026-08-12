/* ==========================================================================
   Elegant Windows & Doors — site.js
   New visual behavior only: header scroll state, scroll-reveal, and the
   Projects page filter/lightbox. This file is additive — it never touches
   #contactForm, #mobileMenuBtn/#mobileMenu, or any element the existing
   config.js / script.js may already be wired to, so the working Telegram
   estimate-request integration is untouched.
   ========================================================================== */

/* Runs immediately (script is loaded at end of body, DOM already parsed):
   flips [data-reveal] into "animate on scroll" mode. Without this class,
   CSS defaults every [data-reveal] element to fully visible, so content
   never depends on JavaScript to be seen. */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Sticky header scroll state ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Scroll-reveal for elements marked data-reveal ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px 200px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
    // Safety net: anything the observer hasn't caught within ~1s is shown
    // anyway. A slightly-early reveal is harmless; content staying hidden
    // is not, so this errs toward showing it.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }, 1000);
  }

  /* ---- Projects page: category filter + lightbox (namespaced "pg-") ---- */
  var grid = document.getElementById('pgGrid');
  if (grid) {
    var tiles = Array.prototype.slice.call(grid.querySelectorAll('.pg-tile'));
    var filterBtns = document.querySelectorAll('.pg-filter-btn');
    var visible = tiles; // current filtered set, for prev/next order

    function applyFilter(cat) {
      visible = [];
      tiles.forEach(function (t) {
        var match = cat === 'all' || t.getAttribute('data-category') === cat;
        t.style.display = match ? '' : 'none';
        if (match) visible.push(t);
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(btn.getAttribute('data-filter'));
      });
    });
    applyFilter('all');

    var lb = document.getElementById('pgLightbox');
    var lbImg = document.getElementById('pgLightboxImg');
    var lbCap = document.getElementById('pgLightboxCap');
    var lbClose = document.getElementById('pgLbClose');
    var lbPrev = document.getElementById('pgLbPrev');
    var lbNext = document.getElementById('pgLbNext');
    var currentIndex = 0;

    function openAt(tile) {
      var idx = visible.indexOf(tile);
      if (idx === -1) return;
      currentIndex = idx;
      render();
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function render() {
      var t = visible[currentIndex];
      if (!t) return;
      var full = t.getAttribute('data-full');
      var cap = t.getAttribute('data-caption') || '';
      lbImg.src = full;
      lbImg.alt = cap;
      lbCap.textContent = cap;
    }

    function close() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }

    function step(dir) {
      if (!visible.length) return;
      currentIndex = (currentIndex + dir + visible.length) % visible.length;
      render();
    }

    tiles.forEach(function (t) {
      t.addEventListener('click', function () { openAt(t); });
    });
    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev) lbPrev.addEventListener('click', function () { step(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { step(1); });
    if (lb) {
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    }
    document.addEventListener('keydown', function (e) {
      if (!lb || !lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
});
