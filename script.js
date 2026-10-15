const WHATSAPP_NUMBER = "59160820426";
const WHATSAPP_MESSAGE = "Hola, Axis Core. Me gustaría solicitar información y una cotización para un proyecto de diseño/animación.";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const setWhatsAppLinks = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  ["#hero-whatsapp", "#contact-button", "#floating-whatsapp"].forEach(id => {
    const el = $(id);
    if (el) el.href = url;
  });
};

const setupMenu = () => {
  const toggle = $(".menu-toggle");
  const nav = $(".main-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  $$('a', nav).forEach(link => link.addEventListener("click", close));
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
};

const setupReveal = () => {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
    observer.observe(item);
  });
};

const setupPortfolioFilters = () => {
  const buttons = $$(".filter-btn");
  const cards = $$(".project-card");
  const count = $("#portfolio-count");

  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.toggle("active", b === button));
    const filter = button.dataset.filter;
    let visible = 0;

    cards.forEach(card => {
      const categories = (card.dataset.category || "").split(" ");
      const show = filter === "todos" || categories.includes(filter);
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (count) count.textContent = String(visible).padStart(2, "0");
  }));
};

const setupScrollUI = () => {
  const progress = $(".scroll-progress span");
  const topButton = $(".back-to-top");
  const wa = $(".floating-whatsapp");

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    topButton?.classList.toggle("visible", window.scrollY > 600);
    wa?.classList.toggle("visible", window.scrollY > 430);
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
};

const setupParallax = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const items = $$('[data-parallax]');
  if (!items.length) return;

  window.addEventListener("pointermove", event => {
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;

    items.forEach(el => {
      const strength = Number(el.dataset.parallax || 10);
      el.style.transform = `translate3d(${nx * strength}px, ${ny * strength}px, 0)`;
    });
  }, { passive: true });
};

const setupCounters = () => {
  const counters = $$('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      let value = 0;
      const duration = 650;
      const start = performance.now();

      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        value = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = value;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => observer.observe(c));
};

const setupHeaderState = () => {
  const header = $(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", update, { passive: true });
  update();
};

window.addEventListener("DOMContentLoaded", () => {
  setWhatsAppLinks();
  setupMenu();
  setupReveal();
  setupPortfolioFilters();
  setupScrollUI();
  setupParallax();
  setupCounters();
  setupHeaderState();

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const preloader = $(".preloader");
  const finish = () => preloader?.classList.add("done");
  window.addEventListener("load", () => setTimeout(finish, 280), { once: true });
  setTimeout(finish, 1800);
});
