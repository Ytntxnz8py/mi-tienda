/* =========================================
   305 RUTA MIAMI — anunciantes.js
   Página de ventas B2B para anunciantes
   ES5 puro, IIFE, sin librerías externas
========================================= */
(function () {
  'use strict';

  /* ===== FLOATING PILL NAV ===== */
  function initFloatingNav() {
    var nav    = document.getElementById('floatingNav');
    var colBtn = nav && nav.querySelector('.fn__collapse-icon');
    var drop   = document.getElementById('fnDropdown');
    if (!nav) return;

    var isMobile      = window.innerWidth <= 768;
    var isExpanded    = true;
    var lastScrollY   = window.pageYOffset;
    var collapseAtY   = 0;
    var EXPAND_DELTA  = 80;
    var expandedWidth = 0;

    function measureWidth() {
      nav.style.width = '';
      expandedWidth = nav.offsetWidth;
      nav.style.width = expandedWidth + 'px';
    }

    function collapse() {
      if (!isExpanded || isMobile) return;
      isExpanded = false;
      nav.classList.add('is-collapsed');
      nav.style.width = '48px';
      if (drop) drop.classList.remove('is-open');
      if (colBtn) colBtn.setAttribute('aria-expanded', 'false');
    }

    function expand() {
      if (isExpanded) return;
      isExpanded = true;
      nav.classList.remove('is-collapsed');
      nav.style.width = expandedWidth + 'px';
      if (drop) drop.classList.remove('is-open');
      if (colBtn) colBtn.setAttribute('aria-expanded', 'false');
      nav.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName !== 'width') return;
        nav.removeEventListener('transitionend', onEnd);
        nav.style.width = '';
      });
    }

    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      if (!isMobile) {
        if (isExpanded && y > lastScrollY && y > 150) {
          collapseAtY = y;
          collapse();
        } else if (!isExpanded && y < lastScrollY && (collapseAtY - y > EXPAND_DELTA)) {
          expand();
        }
      }
      lastScrollY = y;
    }, { passive: true });

    nav.addEventListener('click', function (e) {
      if (!isExpanded && !isMobile) {
        e.stopPropagation();
        expand();
      }
    });

    if (colBtn) {
      colBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isMobile) {
          /* Móvil: toggle del dropdown */
          if (drop) {
            var open = drop.classList.toggle('is-open');
            colBtn.setAttribute('aria-expanded', String(open));
          }
        } else {
          /* Desktop colapsado: expandir la píldora */
          expand();
        }
      });
    }

    document.addEventListener('click', function () {
      if (drop) drop.classList.remove('is-open');
    });

    if (drop) {
      drop.querySelectorAll('.fn__dd-link').forEach(function (a) {
        a.addEventListener('click', function () {
          drop.classList.remove('is-open');
          if (colBtn) colBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    window.addEventListener('resize', function () {
      isMobile = window.innerWidth <= 768;
      if (!isMobile && isExpanded) {
        nav.style.width = '';
        measureWidth();
      }
    });

    requestAnimationFrame(function () {
      measureWidth();
      lastScrollY = window.pageYOffset;
    });
  }

  /* ===== METAL BUTTONS ===== */
  function initMetalButtons(root) {
    var scope = root || document;
    scope.querySelectorAll('.metal-btn-wrap').forEach(function (wrap) {
      if (wrap.dataset.metalInit) return;
      wrap.dataset.metalInit = '1';
      wrap.addEventListener('mousedown',   function () { wrap.classList.add('is-pressed'); });
      wrap.addEventListener('mouseup',     function () { wrap.classList.remove('is-pressed'); });
      wrap.addEventListener('mouseleave',  function () {
        wrap.classList.remove('is-pressed');
        wrap.classList.remove('is-hovered');
      });
      wrap.addEventListener('mouseenter',  function () { wrap.classList.add('is-hovered'); });
      wrap.addEventListener('touchstart',  function () { wrap.classList.add('is-pressed'); },  { passive: true });
      wrap.addEventListener('touchend',    function () { wrap.classList.remove('is-pressed'); });
      wrap.addEventListener('touchcancel', function () { wrap.classList.remove('is-pressed'); });
    });
  }

  /* ===== SCROLL ANIMATION (fade-up) ===== */
  function initScrollAnimation() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
  }

  /* ===== 3D CARD TILT ===== */
  function bindTilt(el, maxTilt) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    maxTilt = maxTilt || 8;

    el.addEventListener('mousemove', function (e) {
      el.classList.add('tilting');
      var rect = el.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var dx   = (e.clientX - cx) / (rect.width  / 2);
      var dy   = (e.clientY - cy) / (rect.height / 2);
      var rotY = dx * maxTilt;
      var rotX = -dy * maxTilt * 0.65;
      el.style.transform =
        'perspective(1000px) rotateY(' + rotY.toFixed(2) + 'deg) rotateX(' + rotX.toFixed(2) + 'deg) translateZ(8px)';
    });

    el.addEventListener('mouseleave', function () {
      el.classList.remove('tilting');
      el.style.transform = '';
    });
  }

  function initCardTilts() {
    /* Skip pricing cards — they use CSS 3D rotate3d via .pc-wrap:hover */
    document.querySelectorAll('.precio-card').forEach(function (card) {
      if (card.closest('.seccion-precios')) return;
      bindTilt(card, 6);
    });
    /* Tilt en la escena del mockup (no en la card directamente para no romper transform 3D) */
    var scene = document.querySelector('.mockup-scene');
    if (scene) {
      scene.addEventListener('mousemove', function (e) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var card = scene.querySelector('.mockup-card');
        if (!card) return;
        var rect = scene.getBoundingClientRect();
        var cx   = rect.left + rect.width  / 2;
        var cy   = rect.top  + rect.height / 2;
        var dx   = (e.clientX - cx) / (rect.width  / 2);
        var dy   = (e.clientY - cy) / (rect.height / 2);
        var rotY = -15 + dx * 10;
        var rotX =   5 + dy * -4;
        card.style.transition = 'none';
        card.style.transform =
          'rotateY(' + rotY.toFixed(2) + 'deg) rotateX(' + rotX.toFixed(2) + 'deg) scale(0.94)';
      });
      scene.addEventListener('mouseleave', function () {
        var card = scene.querySelector('.mockup-card');
        if (!card) return;
        card.style.transition = 'transform 0.55s var(--ease, cubic-bezier(0.2,0,0,1))';
        card.style.transform  = 'rotateY(-15deg) rotateX(5deg) scale(0.92)';
      });
    }
  }

  /* ===== FAQ ACCORDION — height real + clip-path spring ===== */
  function initAccordion() {
    var items  = document.querySelectorAll('.faq-item');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Cierra un ítem con animación */
    function closeItem(item) {
      var wrap    = item.querySelector('.faq-respuesta-wrap');
      var trigger = item.querySelector('.faq-trigger');
      if (!wrap || !item.classList.contains('is-open')) return;

      if (reduced) {
        item.classList.remove('is-open');
        wrap.style.height = '0';
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        return;
      }

      /* Congela la altura actual antes de quitar la clase */
      wrap.style.height = wrap.scrollHeight + 'px';
      item.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');

      /* Siguiente frame: anima a 0 */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wrap.style.height = '0';
        });
      });
    }

    /* Abre un ítem con animación */
    function openItem(item) {
      var wrap    = item.querySelector('.faq-respuesta-wrap');
      var trigger = item.querySelector('.faq-trigger');
      if (!wrap || item.classList.contains('is-open')) return;

      /* Añade clase primero → activa clip-path CSS */
      item.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');

      if (reduced) {
        wrap.style.height = 'auto';
        return;
      }

      /* scrollHeight devuelve el alto real aunque height:0 overflow:hidden */
      var fullH = wrap.scrollHeight;
      wrap.style.height = '0';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wrap.style.height = fullH + 'px';
        });
      });

      /* Tras la transición: libera a 'auto' para que el contenido pueda crecer */
      function onEnd(e) {
        if (e.propertyName !== 'height') return;
        if (item.classList.contains('is-open')) wrap.style.height = 'auto';
        wrap.removeEventListener('transitionend', onEnd);
      }
      wrap.addEventListener('transitionend', onEnd);
    }

    /* Bind de triggers */
    items.forEach(function (item) {
      var trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        /* Cierra todos los abiertos */
        items.forEach(function (i) { closeItem(i); });
        /* Abre el actual solo si estaba cerrado */
        if (!isOpen) openItem(item);
      });
    });
  }

  /* ===== FORMULARIO DE CONTACTO ===== */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojzezpz';

  function initFormContacto() {
    var form  = document.getElementById('formEmpresas');
    var exito = document.getElementById('formEmpresasExito');
    var error = document.getElementById('formEmpresasError');
    if (!form) return;

    var campos = form.querySelectorAll('input[required], select[required], textarea[required]');

    function validateField(campo) {
      var grupo  = campo.parentElement;
      var errMsg = grupo ? grupo.querySelector('.form-error-msg') : null;
      var valid  = campo.checkValidity();
      if (grupo) grupo.classList.toggle('has-error', !valid);
      if (errMsg) errMsg.style.display = valid ? 'none' : 'block';
      return valid;
    }

    campos.forEach(function (campo) {
      campo.addEventListener('blur', function () { validateField(campo); });
      campo.addEventListener('input', function () {
        if (campo.parentElement && campo.parentElement.classList.contains('has-error')) {
          validateField(campo);
        }
      });
    });

    /* Floating label para selects — añade .has-value cuando hay opción elegida */
    form.querySelectorAll('select').forEach(function (sel) {
      function actualizarSelect() {
        sel.classList.toggle('has-value', sel.value !== '');
      }
      sel.addEventListener('change', actualizarSelect);
      actualizarSelect();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      campos.forEach(function (campo) { if (!validateField(campo)) allValid = false; });
      if (!allValid) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (error) error.style.display = 'none';

      function mostrarError() {
        if (submitBtn) submitBtn.disabled = false;
        if (error) {
          error.style.display = '';
          error.setAttribute('aria-live', 'assertive');
        }
      }

      /* Envío real a Formspree (no localStorage): solo mostramos éxito si entrega de verdad */
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (response) {
        if (response.ok) {
          form.style.display = 'none';
          if (error) error.style.display = 'none';
          if (exito) {
            exito.removeAttribute('style');
            exito.setAttribute('aria-live', 'polite');
          }
          form.reset();
        } else {
          mostrarError();
        }
      }).catch(function () {
        mostrarError();
      });
    });
  }

  /* ===== HERO SHUTTER TEXT ===== */
  /*
   * Porta el efecto HeroText React → vanilla ES5.
   * Divide el H1 en palabras, cada una con 3 capas de clip-path
   * que barren la tipografía (top/mid/bot) mientras el texto
   * principal hace blur-fade-in. Stagger por palabra via CSS var(--sw-d).
   */
  function initHeroShutter() {
    var el = document.getElementById('heroShutter');
    if (!el) return;

    /* Lee palabras según idioma activo (clase en <html> o localStorage) */
    function getWords() {
      var lang = 'es';
      if (document.documentElement.classList.contains('lang-en')) {
        lang = 'en';
      } else if (typeof IDIOMA_ACTUAL !== 'undefined') {
        lang = IDIOMA_ACTUAL;
      } else if (localStorage.getItem('em_idioma') === 'en') {
        lang = 'en';
      }
      var attr = el.getAttribute('data-words-' + lang) || el.getAttribute('data-words-es') || '';
      if (attr) return attr.split('|');
      /* Fallback: divide el texto plano original por espacios */
      return (el.textContent || '').trim().split(/\s+/);
    }

    /* Construye el HTML de las palabras con slices */
    function buildHTML(words) {
      return words.map(function (word, i) {
        var delay = (i * 0.13).toFixed(2) + 's';
        return (
          '<span class="sw" style="--sw-d:' + delay + '" aria-hidden="true">' +
            '<span class="sw__main">' + word + '</span>' +
            '<span class="sw__slice sw__slice--top">' + word + '</span>' +
            '<span class="sw__slice sw__slice--mid">' + word + '</span>' +
            '<span class="sw__slice sw__slice--bot">' + word + '</span>' +
          '</span>'
        );
      }).join(' ');
    }

    /* Actualiza aria-label según el idioma */
    function syncAria(words) {
      el.setAttribute('aria-label', words.join(' '));
    }

    function render() {
      var w = getWords();
      el.innerHTML = buildHTML(w);
      syncAria(w);
      el.classList.remove('hero-shutter--pending');
    }

    function play() {
      render();
      el.classList.remove('is-animating');
      /* fuerza reflow para que el navegador reinicie las animations */
      void el.offsetWidth;
      el.classList.add('is-animating');
    }

    play();

    /* Re-renderiza al cambiar idioma — observa la clase de <html> */
    if (window.MutationObserver) {
      var mo = new MutationObserver(function () { play(); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    /* Expuesto globalmente para el botón onclick en HTML */
    window.replayHeroShutter = play;
  }

  /* (initPricingToggle eliminado en Fase 2 — JS muerto: usaba #pricingMonthly/
     #pricingYearly/#pricingSlider, que nunca existieron en el HTML) */

  /* ===== SMOOTH SCROLL para anclas internas ===== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id     = a.getAttribute('href');
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ===== BOTÓN: scroll a sección por id ===== */
  /* Expuesto como global para onclick inline en HTML */
  window.anScrollTo = function (id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* (togglePrecio eliminado en Fase 2 — el toggle mensual/anual se retiró en Fase 1;
     la función quedó sin invocarse desde el HTML) */

  /* ===== ANIMATED FOLDER STEPS ===== */
  /*
    Porta AnimatedFolder (React) → vanilla ES5.
    :hover en CSS maneja el efecto en desktop.
    JS agrega soporte para teclado (Enter/Space) y touch (toggle .is-open).
  */
  function initFolders() {
    var folders = document.querySelectorAll('.cf-folder');
    if (!folders.length) return;

    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    function openFolder(folder) {
      folders.forEach(function (f) {
        f.classList.remove('is-open');
        f.setAttribute('aria-expanded', 'false');
      });
      folder.classList.add('is-open');
      folder.setAttribute('aria-expanded', 'true');
    }

    function closeFolder(folder) {
      folder.classList.remove('is-open');
      folder.setAttribute('aria-expanded', 'false');
    }

    folders.forEach(function (folder) {
      /* Keyboard: Enter / Space toggle */
      folder.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (folder.classList.contains('is-open')) {
            closeFolder(folder);
          } else {
            openFolder(folder);
          }
        }
        if (e.key === 'Escape') { closeFolder(folder); }
      });

      /* Touch devices: tap to toggle (no :hover on mobile) */
      if (isTouchDevice) {
        folder.addEventListener('click', function (e) {
          e.stopPropagation();
          if (folder.classList.contains('is-open')) {
            closeFolder(folder);
          } else {
            openFolder(folder);
          }
        });
      }
    });

    /* Close open folder when clicking outside */
    document.addEventListener('click', function () {
      folders.forEach(function (f) {
        f.classList.remove('is-open');
        f.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== HERO CARDS — clean up entry animation so hover works ===== */
  function initHeroCards() {
    var cards = document.querySelectorAll('.hero-img-card');
    if (!cards.length) return;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    /* After each card's entry animation finishes, remove animation so the
       CSS :hover transition can take over without fighting fill-mode. */
    cards.forEach(function (card) {
      card.addEventListener('animationend', function onEnd() {
        card.removeEventListener('animationend', onEnd);
        card.style.animation = 'none';
        card.style.opacity   = '1';
      });
    });
  }

  /* ===== HERO PARALLAX — mouse-tracking depth layers ===== */
  function initHeroParallax() {
    var section = document.querySelector('.seccion-hero');
    if (!section) return;
    var layers = section.querySelectorAll('[data-depth]');
    if (!layers.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var mx = 0, my = 0; /* target mouse position (−0.5 → +0.5) */
    var cx = 0, cy = 0; /* current (lerped) position */

    function onMouseMove(e) {
      var rect = section.getBoundingClientRect();
      mx = (e.clientX - rect.left)  / rect.width  - 0.5;
      my = (e.clientY - rect.top)   / rect.height - 0.5;
    }
    function onMouseLeave() {
      mx = 0; my = 0; /* drift back to center */
    }

    section.addEventListener('mousemove',  onMouseMove,  { passive: true });
    section.addEventListener('mouseleave', onMouseLeave, { passive: true });

    (function tick() {
      /* smooth lerp — 5% per frame */
      cx += (mx - cx) * 0.05;
      cy += (my - cy) * 0.05;

      layers.forEach(function(layer) {
        var d  = parseFloat(layer.dataset.depth) || 0;
        var tx = cx * d * 55;
        var ty = cy * d * 38;
        layer.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      });
      requestAnimationFrame(tick);
    }());
  }

  /* ===== PARA QUIÉN — blob parallax + underline trigger ===== */
  function initParaQuien() {
    var section  = document.getElementById('para-quien');
    if (!section) return;
    var underline = section.querySelector('.pq-underline');
    var blob1     = section.querySelector('.pq-blob--1');
    var blob2     = section.querySelector('.pq-blob--2');

    /* Underline: IntersectionObserver → add/remove .pq-underline--on */
    if (underline) {
      var ulIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            underline.classList.add('pq-underline--on');
          } else {
            underline.classList.remove('pq-underline--on');
          }
        });
      }, { threshold: 0.3 });
      ulIO.observe(section);
    }

    /* Blobs: scroll-based translateY parallax (soft, reduced-motion safe) */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && (blob1 || blob2)) {
      function onParaScroll() {
        var scrollTop     = window.pageYOffset;
        var sectionTop    = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var progress      = (scrollTop - sectionTop) / sectionHeight;
        if (blob1) blob1.style.transform = 'translateY(' + (-progress * 50) + 'px)';
        if (blob2) blob2.style.transform = 'translateY(' + (progress  * 50) + 'px)';
      }
      window.addEventListener('scroll', onParaScroll, { passive: true });
      onParaScroll();
    }
  }

  /* ===== IDIOMA ES / EN (anunciantes.html) ===== */
  /* Versión liviana: no requiere i18n.js — solo toggle clase en <html> */
  window.toggleIdiomaAn = function () {
    var html    = document.documentElement;
    var current = localStorage.getItem('em_idioma') || html.lang || 'es';
    var next    = current === 'es' ? 'en' : 'es';

    /* Toggle clase CSS */
    html.classList.remove('lang-es', 'lang-en');
    html.classList.add('lang-' + next);
    html.lang = next;
    localStorage.setItem('em_idioma', next);

    /* Actualizar texto del botón de idioma desktop */
    var btn = document.getElementById('btnIdioma');
    if (btn) btn.textContent = next === 'es' ? 'ES' : 'EN';
  };

  /* Sincronizar botón desktop con idioma guardado */
  function initIdiomaAn() {
    var saved = localStorage.getItem('em_idioma') || 'es';
    var html  = document.documentElement;
    html.classList.remove('lang-es', 'lang-en');
    html.classList.add('lang-' + saved);
    html.lang = saved;
    var btn = document.getElementById('btnIdioma');
    if (btn) btn.textContent = saved === 'es' ? 'ES' : 'EN';
  }

  /* ===== CARRUSEL DE PRECIOS ===== */
  function initPreciosCarousel() {
    var scrollWrap = document.getElementById('preciosScrollWrap');
    var prev       = document.getElementById('precCarPrev');
    var next       = document.getElementById('precCarNext');
    if (!scrollWrap || !prev || !next) return;

    function cardWidth() {
      var card = scrollWrap.querySelector('.precio-card');
      if (!card) return 340;
      return card.offsetWidth + 24; /* offsetWidth + gap(1.5rem≈24px) */
    }

    function updateBtns() {
      prev.disabled = scrollWrap.scrollLeft <= 2;
      next.disabled = scrollWrap.scrollLeft >= scrollWrap.scrollWidth - scrollWrap.clientWidth - 2;
    }

    prev.addEventListener('click', function () {
      scrollWrap.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      scrollWrap.scrollBy({ left:  cardWidth(), behavior: 'smooth' });
    });
    scrollWrap.addEventListener('scroll', updateBtns, { passive: true });
    updateBtns();
  }

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', function () {
    initIdiomaAn();
    initHeroShutter();      /* shutter text — antes que fade-up para que no compita */
    initHeroCards();
    initHeroParallax();
    initFloatingNav();
    initMetalButtons();
    initScrollAnimation();
    initCardTilts();
    initFolders();
    initParaQuien();
    initPreciosCarousel();
    initAccordion();
    initFormContacto();
    initSmoothScroll();
  });

}());

/* ============================================
   SISTEMA DE RESEÑAS REALES
   Guarda en localStorage.em_resenas_publicas
   ============================================ */
(function initResenas() {
  'use strict';

  var STORAGE_KEY = 'em_resenas_publicas';

  function obtenerResenas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) { return []; }
  }

  function guardarResena(resena) {
    var lista = obtenerResenas();
    lista.unshift(resena);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lista)); } catch (e) {}
  }

  function renderEstrellas(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += i <= rating
        ? '<span aria-hidden="true">★</span>'
        : '<span class="star-empty" aria-hidden="true">★</span>';
    }
    return html;
  }

  function formatearFecha(iso) {
    try {
      var d = new Date(iso);
      var lang = document.documentElement.classList.contains('lang-en') ? 'en-US' : 'es-ES';
      return d.toLocaleDateString(lang, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return ''; }
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function renderLista() {
    var grid = document.getElementById('resenasGrid');
    var empty = document.getElementById('resenasEmpty');
    if (!grid || !empty) return;

    var lista = obtenerResenas();
    if (lista.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    var html = '';
    for (var i = 0; i < lista.length; i++) {
      var r = lista[i];
      html += '<article class="resena-card">' +
        '<div class="resena-rating" aria-label="Rating ' + r.rating + ' de 5">' +
          renderEstrellas(r.rating) +
        '</div>' +
        '<p class="resena-texto">' + escapeHTML(r.texto) + '</p>' +
        '<div class="resena-autor">' +
          '<strong>' + escapeHTML(r.nombre) + '</strong>' +
          (r.empresa ? ' &middot; ' + escapeHTML(r.empresa) : '') +
          '<span class="resena-fecha">' + escapeHTML(formatearFecha(r.fecha)) + '</span>' +
        '</div>' +
      '</article>';
    }
    grid.innerHTML = html;
  }

  function initEstrellas() {
    var stars = document.querySelectorAll('.resenas-star');
    var input = document.getElementById('resenaRating');
    if (!stars.length || !input) return;

    function actualizarEstrellas(valor) {
      for (var i = 0; i < stars.length; i++) {
        if ((i + 1) <= valor) {
          stars[i].classList.add('active');
        } else {
          stars[i].classList.remove('active');
        }
      }
    }

    actualizarEstrellas(parseInt(input.value, 10) || 5);

    for (var j = 0; j < stars.length; j++) {
      (function(star) {
        star.addEventListener('click', function() {
          var val = parseInt(star.getAttribute('data-value'), 10);
          input.value = val;
          actualizarEstrellas(val);
        });
      })(stars[j]);
    }
  }

  function initFormulario() {
    var form = document.getElementById('resenaForm');
    var exito = document.getElementById('resenaExito');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var nombre = (document.getElementById('resenaNombre').value || '').trim();
      var empresa = (document.getElementById('resenaEmpresa').value || '').trim();
      var rating = parseInt(document.getElementById('resenaRating').value, 10) || 5;
      var texto = (document.getElementById('resenaTexto').value || '').trim();

      if (nombre.length < 2 || texto.length < 20) {
        if (nombre.length < 2) document.getElementById('resenaNombre').focus();
        else document.getElementById('resenaTexto').focus();
        return;
      }

      var nueva = {
        nombre: nombre.substring(0, 60),
        empresa: empresa.substring(0, 80),
        rating: Math.min(5, Math.max(1, rating)),
        texto: texto.substring(0, 500),
        fecha: new Date().toISOString()
      };

      guardarResena(nueva);
      form.reset();
      document.getElementById('resenaRating').value = 5;
      initEstrellas();
      renderLista();

      if (exito) {
        exito.hidden = false;
        setTimeout(function() { exito.hidden = true; }, 4500);
      }

      var primera = document.querySelector('.resena-card');
      if (primera && primera.scrollIntoView) {
        primera.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function init() {
    if (!document.getElementById('resenasGrid')) return;
    renderLista();
    initEstrellas();
    initFormulario();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ============================================================
   PRECIOS — Canvas WebGL shader + ripple buttons
   Portado de React ShaderCanvas a ES5 vanilla JS
   ============================================================ */
(function () {
  'use strict';

  /* ── Vertex shader — quad de pantalla completa ── */
  var VERT_SRC = [
    'attribute vec2 a_position;',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* ── Fragment shader — círculos concéntricos con variación senoidal ── */
  var FRAG_SRC = [
    'precision mediump float;',
    'uniform float iTime;',
    'uniform vec2  iResolution;',
    'uniform vec3  uBackgroundColor;',
    '',
    'float variation(vec2 v1, vec2 v2, float strength, float speed) {',
    '  return sin(',
    '    dot(normalize(v1 - v2), vec2(0.5, 1.2)) * strength + iTime * speed',
    '  ) / 100.0;',
    '}',
    '',
    'vec4 paintCircle(vec2 uv, vec2 center, float rad, float width) {',
    '  vec2  diff   = center - uv;',
    '  float len    = length(diff);',
    '  len += variation(diff, vec2(0.0), 0.5, 1.6);',
    '  len -= variation(diff, vec2(0.0), 0.5, 1.2);',
    '  float circle = smoothstep(rad - width, rad, len)',
    '               - smoothstep(rad, rad + width, len);',
    '  return vec4(circle);',
    '}',
    '',
    'mat2 rotate2d(float angle) {',
    '  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));',
    '}',
    '',
    'void main() {',
    '  vec2 uv     = gl_FragCoord.xy / iResolution.xy;',
    '  uv.x       *= 1.5; uv.x -= 0.25;',
    '  float mask  = 0.0;',
    '  float radius = 0.35;',
    '  vec2  center = vec2(0.5);',
    '  mask += paintCircle(uv, center, radius,         0.035).r;',
    '  mask += paintCircle(uv, center, radius - 0.018, 0.010).r;',
    '  mask += paintCircle(uv, center, radius + 0.018, 0.005).r;',
    '  vec2 v     = rotate2d(iTime) * uv;',
    '  vec3 fg    = vec3(v.x, v.y, 0.7 - v.y * v.x);',
    '  vec3 color = mix(uBackgroundColor, fg, mask);',
    '  color = mix(color, vec3(1.0), paintCircle(uv, center, radius, 0.003).r);',
    '  gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n');

  /* ── Inicializar canvas WebGL ── */
  function initShaderCanvas() {
    var canvas = document.getElementById('preciosCanvas');
    if (!canvas) { return; }

    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      /* Sin soporte WebGL — ocultar canvas y dejar fondo liso */
      canvas.style.display = 'none';
      return;
    }

    /* Compilar shader individual */
    function compileShader(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    var vert = compileShader(gl.VERTEX_SHADER,   VERT_SRC);
    var frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) { return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { return; }
    gl.useProgram(prog);

    /* Quad de pantalla completa — 2 triángulos */
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,   -1,  1,
       1, -1,   1,  1,   -1,  1
    ]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uTime       = gl.getUniformLocation(prog, 'iTime');
    var uResolution = gl.getUniformLocation(prog, 'iResolution');
    var uBgColor    = gl.getUniformLocation(prog, 'uBackgroundColor');

    /* Color de fondo: --blanco-arena #FFFDF7 → RGB normalizado */
    gl.uniform3f(uBgColor, 1.0, 0.992, 0.969);

    /* Redimensionar canvas al tamaño de la sección padre */
    function resize() {
      var parent = canvas.parentElement;
      if (!parent) { return; }
      canvas.width  = Math.round(parent.offsetWidth)  || 800;
      canvas.height = Math.round(parent.offsetHeight) || 600;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    /* Detectar preferencia de movimiento reducido */
    var prefersReduced = !!(window.matchMedia &&
                            window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var start  = performance.now();
    var rafId  = null;
    var active = true;

    function render() {
      if (!active) { return; }
      if (prefersReduced) {
        /* Render único estático — patrón visible sin movimiento */
        gl.uniform1f(uTime, 1.4);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return;
      }
      rafId = requestAnimationFrame(render);
      var t = (performance.now() - start) * 0.001;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    /* Pausar cuando la sección sale del viewport — ahorra GPU */
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            active = true;
            if (!rafId && !prefersReduced) { render(); }
          } else {
            active = false;
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          }
        });
      }, { threshold: 0 });
      io2.observe(canvas.parentElement);
    }

    /* Primer render */
    render();
  }

  /* ── Ripple para .pc-cta-btn ── */
  function initRippleButtons() {
    var btns = document.querySelectorAll('.pc-cta-btn');
    var i;
    for (i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function (e) {
          var rect   = btn.getBoundingClientRect();
          var x      = e.clientX - rect.left;
          var y      = e.clientY - rect.top;
          var size   = Math.max(rect.width, rect.height) * 1.4;
          var ripple = document.createElement('span');
          ripple.className    = 'pc-ripple';
          ripple.style.width  = size + 'px';
          ripple.style.height = size + 'px';
          ripple.style.left   = (x - size / 2) + 'px';
          ripple.style.top    = (y - size / 2) + 'px';
          btn.appendChild(ripple);
          /* Limpiar elemento después de la animación */
          setTimeout(function () {
            if (ripple.parentNode) { ripple.parentNode.removeChild(ripple); }
          }, 620);
        });
      }(btns[i]));
    }
  }

  /* ── Inicialización ── */
  function init() {
    initShaderCanvas();
    initRippleButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
