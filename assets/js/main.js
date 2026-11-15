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
  "use strict";

  /* ---------- Tema claro/oscuro ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const getTheme = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  const syncThemeUI = () => {
    const isDark = getTheme() === "dark";

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDark ? "#0d1117" : "#ffffff");
    }
  };

  const applyTheme = (theme, persist) => {
    root.setAttribute("data-theme", theme);

    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        /* El navegador puede bloquear localStorage; el tema sigue funcionando. */
      }
    }

    syncThemeUI();
  };

  syncThemeUI();

  themeToggle?.addEventListener("click", () => {
    applyTheme(getTheme() === "dark" ? "light" : "dark", true);
  });

  systemTheme.addEventListener("change", (event) => {
    let stored = null;

    try {
      stored = localStorage.getItem("theme");
    } catch (error) {
      /* Ignorar. */
    }

    if (!stored) {
      applyTheme(event.matches ? "dark" : "light", false);
    }
  });

  /* ---------- Navegación móvil ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  };

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---------- Animaciones de entrada ---------- */
  let revealObserver = null;

  const observeReveals = (scope = document) => {
    const elements = scope.querySelectorAll(".reveal:not(.is-visible)");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);

            // Quita el retraso para no afectar las transiciones de hover.
            window.setTimeout(() => {
              entry.target.style.transitionDelay = "";
            }, 800);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
      revealObserver.observe(element);
    });
  };

  observeReveals();

  /* ---------- Proyectos ---------- */
  const projectsGrid = document.getElementById("projects-grid");
  const projectsEmpty = document.getElementById("projects-empty");

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });

  const createProjectCard = (project) => {
    const title = typeof project.title === "string" ? project.title.trim() : "";
    const description = typeof project.description === "string" ? project.description.trim() : "";
    const tech = Array.isArray(project.tech) ? project.tech.filter((item) => typeof item === "string") : [];

    const image =
      typeof project.image === "string" && project.image.trim()
        ? `<img src="${escapeHTML(project.image)}" alt="Captura del proyecto ${escapeHTML(title)}" loading="lazy" width="640" height="360">`
        : `<div class="project-card__placeholder" aria-hidden="true">${escapeHTML(title.slice(0, 2).toUpperCase())}</div>`;

    const techList = tech.length
      ? `<ul class="tags project-card__tech">${tech.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`
      : "";

    const links = [];

    if (typeof project.demo === "string" && project.demo.trim()) {
      links.push(
        `<a class="project-card__link" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">Demo <span aria-hidden="true">↗</span></a>`
      );
    }

    if (typeof project.repo === "string" && project.repo.trim()) {
      links.push(
        `<a class="project-card__link" href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer">Código <span aria-hidden="true">↗</span></a>`
      );
    }

    return `
      <article class="project-card reveal">
        <div class="project-card__media">${image}</div>
        <div class="project-card__body">
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(description)}</p>
          ${techList}
          ${links.length ? `<div class="project-card__links">${links.join("")}</div>` : ""}
        </div>
      </article>
    `;
  };

  const loadProjects = async () => {
    if (!projectsGrid || !projectsEmpty) return;

    try {
      const response = await fetch("data/projects.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`No se pudo cargar projects.json (HTTP ${response.status})`);

      const data = await response.json();
      const projects = Array.isArray(data) ? data : Array.isArray(data?.projects) ? data.projects : [];

      if (!projects.length) return;

      const validProjects = projects.filter(
        (project) => project && typeof project.title === "string" && project.title.trim()
      );

      if (!validProjects.length) return;

      projectsGrid.innerHTML = validProjects.map(createProjectCard).join("");
      projectsGrid.hidden = false;
      projectsEmpty.hidden = true;

      observeReveals(projectsGrid);
    } catch (error) {
      // El estado vacío se mantiene visible si falla la carga.
      console.warn("Proyectos no disponibles:", error);
    }
  };

  loadProjects();

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  const setFormStatus = (message, type = "") => {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove("is-success", "is-error");

    if (type) formStatus.classList.add(`is-${type}`);
  };

  if (form) {
    const accessKeyField = form.querySelector('input[name="access_key"]');
    const fallbackEmail = form.dataset.fallbackEmail || "contacto.gustavog@gmail.com";
    const accessKey = accessKeyField?.value.trim() || "";
    const isWeb3FormsConfigured = Boolean(accessKey) && !/REEMPLAZA/i.test(accessKey);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      // Honeypot: los humanos no ven ni marcan este campo.
      if (formData.get("botcheck")) {
        setFormStatus("Mensaje enviado. Gracias por escribir.", "success");
        return;
      }

      if (!name || !email || !message) {
        setFormStatus("Completa todos los campos para continuar.", "error");
        return;
      }

      if (!isWeb3FormsConfigured) {
        const subject = encodeURIComponent(`Contacto desde el portafolio — ${name}`);
        const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);

        window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
        setFormStatus(`Se abrió tu cliente de correo. Si no ocurre, escríbeme a ${fallbackEmail}.`, "success");
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const submitLabel = submitButton?.querySelector(".btn__label");
      const originalButtonText = submitLabel ? submitLabel.textContent : "";

      if (submitButton) {
        submitButton.disabled = true;
      }

      if (submitLabel) {
        submitLabel.textContent = "Enviando...";
      }

      setFormStatus("Enviando mensaje...");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          form.reset();
          setFormStatus("¡Mensaje enviado! Te responderé pronto.", "success");
        } else {
          setFormStatus(
            result.message || "No se pudo enviar el mensaje. Intenta de nuevo o escríbeme por email.",
            "error"
          );
        }
      } catch (error) {
        setFormStatus(`No se pudo enviar. Revisa tu conexión o escríbeme a ${fallbackEmail}.`, "error");
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
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();

//* ---------- Animación terminal → navegador ---------- */
const typedEl = document.getElementById("typed-text");
const outputEl = document.getElementById("terminal-output");
const terminalEl = document.getElementById("terminal");
const browserEl = document.getElementById("browser");
const browserBodyEl = document.getElementById("browser-body");
const browserUrlEl = document.getElementById("browser-url-text");

if (typedEl && outputEl && terminalEl && browserEl && browserBodyEl && browserUrlEl) {
  const TYPING_SPEED = 70;
  const PAUSE_AFTER_TYPE = 600;
  const SHOW_BROWSER_FOR = 4500;
  const RESTART_AFTER = 2000;

  const ICONS = {
    cafe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z"/><path d="M6 2v3M10 2v3M14 2v3"/></svg>`,
    industrial: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    salud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  };

  const CLIENTS = [
    {
      cmd: "npx create-site cafe-aurora",
      url: "cafeaurora.cl",
      name: "Café Aurora",
      theme: "cafe",
      logo: "Café <em>Aurora</em>",
      nav: "Menú · Nosotros · Contacto",
      title: "Café de especialidad",
      tagline: "Tostado artesanal, todos los días.",
      btn: "Ver menú",
      info: [
        ["📍 Providencia 1234", "Santiago, Chile"],
        ["🕐 Lun a Sáb", "8:00 – 20:00 hrs"],
        ["✉ hola@cafeaurora.cl", "Reservas y pedidos"]
      ]
    },
    {
      cmd: "npx create-site taller-norte",
      url: "tallernorte.cl",
      name: "Taller Norte",
      theme: "industrial",
      logo: "TALLER <em>NORTE</em>", // Mayúsculas para sentir más "industrial"
      nav: "Servicios · Diagnóstico · Contacto",
      title: "Mecánica pesada y liviana",
      tagline: "Diagnóstico computarizado con garantía real.",
      btn: "Pedir hora",
      info: [
        ["📍 Av. Independencia 567", "Santiago, Chile"],
        ["🕐 Lun a Vie", "9:00 – 18:00 hrs"],
        ["✉ contacto@tallernorte.cl", "Presupuestos sin costo"]
      ]
    },
    {
      cmd: "npx create-site clinica-vida",
      url: "clinicavida.cl",
      name: "Clínica Vida",
      theme: "salud",
      logo: "Clínica <em>Vida</em>",
      nav: "Especialidades · Convenios · Contacto",
      title: "Tu salud, nuestra prioridad",
      tagline: "Atención médica con estándares de excelencia.",
      btn: "Agendar hora",
      info: [
        ["📍 Av. Apoquindo 3456", "Las Condes, Santiago"],
        ["🕐 Urgencias", "24 horas, todos los días"],
        ["✉ pacientes@clinicavida.cl", "Horas médicas en línea"]
      ]
    }
  ];

  let clientIndex = 0;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const renderBrowser = (client) => {
    browserUrlEl.textContent = client.url;
    browserBodyEl.className = `browser__body browser__body--${client.theme}`;

    browserBodyEl.innerHTML = `
      <nav class="mini-nav">
        <span class="mini-nav__logo">${client.logo}</span>
        <span class="mini-nav__links">${client.nav}</span>
      </nav>

      <div class="mini-hero">
        <div class="mini-hero__text">
          <h4>${client.title}</h4>
          <p>${client.tagline}</p>
          <span class="mini-hero__btn">${client.btn}</span>
        </div>
        <div class="mini-hero__img" aria-hidden="true">${ICONS[client.theme]}</div>
      </div>

      <div class="mini-cards">
        ${client.info
          .map(
            ([strong, span]) => `
          <div class="mini-card">
            <strong>${strong}</strong>
            <span>${span}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  };

  async function typeCommand() {
    const client = CLIENTS[clientIndex % CLIENTS.length];
    clientIndex++;

    typedEl.textContent = "";
    outputEl.innerHTML = "";
    terminalEl.classList.remove("is-hidden");
    browserEl.classList.remove("is-visible");

    for (const char of client.cmd) {
      typedEl.textContent += char;
      await sleep(TYPING_SPEED + Math.random() * 40);
    }

    await sleep(PAUSE_AFTER_TYPE);

    outputEl.innerHTML = `
      <div>📦 Generando estructura para ${client.name}...</div>
      <div class="ok">✓ Landing, servicios y contacto creados</div>
      <div class="ok">✓ Identidad visual del cliente aplicada</div>
      <div class="ok">✓ Publicado en ${client.url}</div>
    `;

    await sleep(1200);

    renderBrowser(client);

    terminalEl.classList.add("is-hidden");
    await sleep(400);
    browserEl.classList.add("is-visible");

    await sleep(SHOW_BROWSER_FOR);

    browserEl.classList.remove("is-visible");
    await sleep(RESTART_AFTER);
    typeCommand();
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    renderBrowser(CLIENTS[0]);
    terminalEl.classList.add("is-hidden");
    browserEl.classList.add("is-visible");
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeCommand();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(terminalEl);
  }
}
