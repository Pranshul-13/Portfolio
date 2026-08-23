/* ==========================================================================
   Pranshul Pamecha — Portfolio
   Sidebar inversion over dark bands, fullscreen mobile nav, scroll reveal,
   active-section tracking, copy email.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDesktop = window.matchMedia('(min-width: 1025px)');

  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('navToggle');

  /* ------------------------------------------------- Fullscreen mobile nav */

  function setMenu(open) {
    if (!sidebar || !toggle) return;
    sidebar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      setMenu(!sidebar.classList.contains('is-open'));
    });

    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('.sb-link') || e.target.closest('.sb-name')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    var onBreakpoint = function () { if (mqDesktop.matches) setMenu(false); };
    if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onBreakpoint);
    else if (mqDesktop.addListener) mqDesktop.addListener(onBreakpoint);
  }

  /* ------------------------------------ Sidebar inversion over dark bands */
  /* A dark band "owns" the sidebar while it crosses the viewport centre.   */

  var darkBands = document.querySelectorAll('[data-dark]');

  if (sidebar && darkBands.length && 'IntersectionObserver' in window) {
    var active = new Set();

    var darkObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      sidebar.classList.toggle('is-inverted', active.size > 0 && mqDesktop.matches);
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    darkBands.forEach(function (band) { darkObserver.observe(band); });
  }

  /* --------------------------------------------------------- Scroll reveal */

  var revealEls = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------ Active section in nav */

  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.sb-link[data-nav]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('data-nav') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ------------------------------------------------------------------ Toast */

  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  /* ------------------------------------------------------------ Copy email */

  var copyBtn = document.getElementById('copyEmail');
  var copyText = document.getElementById('copyEmailText');

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';

      var done = function () {
        showToast('Email address copied');
        if (copyText) {
          var original = copyText.textContent;
          copyText.textContent = 'Copied';
          setTimeout(function () { copyText.textContent = original; }, 1800);
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done).catch(function () { showToast(email); });
      } else {
        var field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'absolute';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.select();
        try { document.execCommand('copy'); done(); } catch (err) { showToast(email); }
        document.body.removeChild(field);
      }
    });
  }

  /* ------------------------------------------------------------------- Year */

  var y = String(new Date().getFullYear());
  ['year', 'yearFoot'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = y;
  });
})();
