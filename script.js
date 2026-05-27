/* ============================================================
   REBL — vanilla JS enhancements
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Theme ----------
  const themeBtn = $("#themeBtn");
  const root = document.documentElement;

  function preferredTheme() {
    const saved = localStorage.getItem("rebl-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("rebl-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
      themeBtn.setAttribute("title", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
  }
  applyTheme(preferredTheme());
  themeBtn && themeBtn.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  // ---------- Mobile menu ----------
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");
  menuBtn && menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("#nav a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn && menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  // ---------- Smooth scroll ----------
  $$(".nav a[href^='#'], a.btn[href^='#'], a.brand[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });

  // ---------- Active section highlight ----------
  const sections = $$("main section[id]");
  const navLinks = $$("#nav a[href^='#']");
  const linkById = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.getAttribute("id");
      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      const link = linkById.get(id);
      link && link.setAttribute("aria-current", "page");
    },
    { root: null, threshold: [0.1, 0.25, 0.5, 0.75] }
  );
  sections.forEach((s) => observer.observe(s));

  // ---------- Toast ----------
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  // ---------- Copy helpers ----------
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        showToast("Copied to clipboard");
      } catch {
        showToast("Copy failed");
      }
    });
  });

  // ---------- Publications filtering ----------
  const pubRoot = $("#pubs");
  if (pubRoot) {
    const search = $("#pubSearch");
    const pubItems = $$(".pub", pubRoot);
    const yearBtns = $$("[data-year]", pubRoot);
    const typeBtns = $$("[data-type]", pubRoot);
    const countEl = $("#pubCount");
    const state = { year: "all", type: "all", q: "" };

    function setPressed(btns, activeValue, attr) {
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === activeValue)));
    }
    const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

    function applyFilters() {
      const q = normalize(state.q);
      let shown = 0;
      for (const item of pubItems) {
        const year = item.dataset.year || "";
        const type = item.dataset.kind || "";
        const okYear = state.year === "all" || year === state.year;
        const okType = state.type === "all" || type === state.type;
        const hay = normalize(item.textContent);
        const okQ = !q || hay.includes(q);
        const show = okYear && okType && okQ;
        item.style.display = show ? "" : "none";
        if (show) shown++;
      }
      if (countEl) countEl.textContent = String(shown);
    }
    yearBtns.forEach((b) =>
      b.addEventListener("click", () => {
        state.year = b.getAttribute("data-year") || "all";
        setPressed(yearBtns, state.year, "data-year");
        applyFilters();
      })
    );
    typeBtns.forEach((b) =>
      b.addEventListener("click", () => {
        state.type = b.getAttribute("data-type") || "all";
        setPressed(typeBtns, state.type, "data-type");
        applyFilters();
      })
    );
    search && search.addEventListener("input", () => {
      state.q = search.value || "";
      applyFilters();
    });

    window.addEventListener("keydown", (e) => {
      const tag = (document.activeElement && document.activeElement.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        search && search.focus();
      }
      if (e.key === "Escape" && document.activeElement === search) {
        search.value = "";
        state.q = "";
        applyFilters();
        search.blur();
      }
    });
    applyFilters();
  }

  // ---------- Hero cheetah fade ----------
  const cheetahImg = document.querySelector('.hero-cheetah');
  const researchSec = document.querySelector('#research');
  if (cheetahImg && researchSec) {
    const BASE_OPACITY = 1.0;
    function updateCheetah() {
      const top = researchSec.getBoundingClientRect().top;
      const vh = window.innerHeight;
      cheetahImg.style.opacity = (BASE_OPACITY * Math.max(0, Math.min(1, top / vh))).toFixed(3);
    }
    window.addEventListener('scroll', updateCheetah, { passive: true });
    updateCheetah();
  }

  // ---------- People expand/collapse ----------
  const peopleGrid = $(".people-grid");
  $$(".person").forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const isExpanded = card.classList.contains("expanded");
      $$(".person.expanded").forEach((c) => c.classList.remove("expanded"));
      if (peopleGrid) {
        peopleGrid.classList.remove("expanded-0", "expanded-1", "expanded-2", "has-expanded");
      }
      if (!isExpanded) {
        card.classList.add("expanded");
        if (card.hasAttribute("data-wide") && peopleGrid) {
          peopleGrid.classList.add(`expanded-${index}`, "has-expanded");
        }
      }
    });
  });
})();
