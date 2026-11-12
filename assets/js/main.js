/* =========================================================
   Portafolio de Gustavo Gallegos
   JavaScript sin dependencias:
   - Tema claro/oscuro persistente
   - Navegación móvil
   - Animaciones de entrada
   - Proyectos desde data/projects.json
   - Formulario con Web3Forms y fallback a mailto
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Tema claro/oscuro ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  const getTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  const syncThemeUI = () => {
    const isDark = getTheme() === 'dark';

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#0d1117' : '#ffffff');
    }
  };

  const applyTheme = (theme, persist) => {
    root.setAttribute('data-theme', theme);

    if (persist) {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        /* El navegador puede bloquear localStorage; el tema sigue funcionando. */
      }
    }

    syncThemeUI();
  };

  syncThemeUI();

  themeToggle?.addEventListener('click', () => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark', true);
  });

  systemTheme.addEventListener('change', (event) => {
    let stored = null;

    try {
      stored = localStorage.getItem('theme');
    } catch (error) {
      /* Ignorar. */
    }

    if (!stored) {
      applyTheme(event.matches ? 'dark' : 'light', false);
    }
  });

  /* ---------- Navegación móvil ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---------- Animaciones de entrada ---------- */
  let revealObserver = null;

  const observeReveals = (scope = document) => {
    const elements = scope.querySelectorAll('.reveal:not(.is-visible)');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);

            // Quita el retraso para no afectar las transiciones de hover.
            window.setTimeout(() => {
              entry.target.style.transitionDelay = '';
            }, 800);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
    }

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
      revealObserver.observe(element);
    });
  };

  observeReveals();

  /* ---------- Proyectos ---------- */
  const projectsGrid = document.getElementById('projects-grid');
  const projectsEmpty = document.getElementById('projects-empty');

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      return entities[character];
    });

  const createProjectCard = (project) => {
    const title = typeof project.title === 'string' ? project.title.trim() : '';
    const description = typeof project.description === 'string' ? project.description.trim() : '';
    const tech = Array.isArray(project.tech) ? project.tech.filter((item) => typeof item === 'string') : [];

    const image = typeof project.image === 'string' && project.image.trim()
      ? `<img src="${escapeHTML(project.image)}" alt="Captura del proyecto ${escapeHTML(title)}" loading="lazy" width="640" height="360">`
      : `<div class="project-card__placeholder" aria-hidden="true">${escapeHTML(title.slice(0, 2).toUpperCase())}</div>`;

    const techList = tech.length
      ? `<ul class="tags project-card__tech">${tech.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
      : '';

    const links = [];

    if (typeof project.demo === 'string' && project.demo.trim()) {
      links.push(`<a class="project-card__link" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">Demo <span aria-hidden="true">↗</span></a>`);
    }

    if (typeof project.repo === 'string' && project.repo.trim()) {
      links.push(`<a class="project-card__link" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">Código <span aria-hidden="true">↗</span></a>`);
    }

    return `
      <article class="project-card reveal">
        <div class="project-card__media">${image}</div>
        <div class="project-card__body">
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(description)}</p>
          ${techList}
          ${links.length ? `<div class="project-card__links">${links.join('')}</div>` : ''}
        </div>
      </article>
    `;
  };

  const loadProjects = async () => {
    if (!projectsGrid || !projectsEmpty) return;

    try {
      const response = await fetch('data/projects.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`No se pudo cargar projects.json (HTTP ${response.status})`);

      const data = await response.json();
      const projects = Array.isArray(data)
        ? data
        : Array.isArray(data?.projects)
          ? data.projects
          : [];

      if (!projects.length) return;

      const validProjects = projects.filter(
        (project) => project && typeof project.title === 'string' && project.title.trim()
      );

      if (!validProjects.length) return;

      projectsGrid.innerHTML = validProjects.map(createProjectCard).join('');
      projectsGrid.hidden = false;
      projectsEmpty.hidden = true;

      observeReveals(projectsGrid);
    } catch (error) {
      // El estado vacío se mantiene visible si falla la carga.
      console.warn('Proyectos no disponibles:', error);
    }
  };

  loadProjects();

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  const setFormStatus = (message, type = '') => {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove('is-success', 'is-error');

    if (type) formStatus.classList.add(`is-${type}`);
  };

  if (form) {
    const accessKeyField = form.querySelector('input[name="access_key"]');
    const fallbackEmail = form.dataset.fallbackEmail || 'contacto.gustavog@gmail.com';
    const accessKey = accessKeyField?.value.trim() || '';
    const isWeb3FormsConfigured = Boolean(accessKey) && !/REEMPLAZA/i.test(accessKey);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      // Honeypot: los humanos no ven ni marcan este campo.
      if (formData.get('botcheck')) {
        setFormStatus('Mensaje enviado. Gracias por escribir.', 'success');
        return;
      }

      if (!name || !email || !message) {
        setFormStatus('Completa todos los campos para continuar.', 'error');
        return;
      }

      if (!isWeb3FormsConfigured) {
        const subject = encodeURIComponent(`Contacto desde el portafolio — ${name}`);
        const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);

        window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
        setFormStatus(
          `Se abrió tu cliente de correo. Si no ocurre, escríbeme a ${fallbackEmail}.`,
          'success'
        );
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const submitLabel = submitButton?.querySelector('.btn__label');
      const originalButtonText = submitLabel ? submitLabel.textContent : '';

      if (submitButton) {
        submitButton.disabled = true;
      }

      if (submitLabel) {
        submitLabel.textContent = 'Enviando...';
      }

      setFormStatus('Enviando mensaje...');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          form.reset();
          setFormStatus('¡Mensaje enviado! Te responderé pronto.', 'success');
        } else {
          setFormStatus(
            result.message || 'No se pudo enviar el mensaje. Intenta de nuevo o escríbeme por email.',
            'error'
          );
        }
      } catch (error) {
        setFormStatus(
          `No se pudo enviar. Revisa tu conexión o escríbeme a ${fallbackEmail}.`,
          'error'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }

        if (submitLabel) {
          submitLabel.textContent = originalButtonText;
        }
      }
    });
  }

  /* ---------- Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
