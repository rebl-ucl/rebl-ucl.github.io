/* ============================================================
   REBL — vanilla JS enhancements
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = document.documentElement;

  // ---------- Theme (day / night) ----------
  const themeBtn = $("#themeBtn");
  function applyTheme(mode) {
    if (mode === "night") root.setAttribute("data-theme", "night");
    else root.removeAttribute("data-theme");
    localStorage.setItem("rebl-theme", mode);
    if (themeBtn) {
      const label = mode === "night" ? "Switch to day mode" : "Switch to night mode";
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
    }
  }
  const savedTheme = localStorage.getItem("rebl-theme");
  applyTheme(
    savedTheme === "night" || savedTheme === "dark" ? "night" :
    savedTheme === "day" || savedTheme === "light" ? "day" :
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"
  );
  themeBtn && themeBtn.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "night" ? "day" : "night");
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
    const totalEl = $("#pubTotal");
    const emptyEl = $("#pubEmpty");
    // null means "this filter is off". Pressing an active chip turns it back
    // off, which — with nothing else active — empties the list again.
    const state = { year: null, type: null, q: "" };
    if (totalEl) totalEl.textContent = String(pubItems.length);

    function setPressed(btns, activeValue, attr) {
      btns.forEach((b) =>
        b.setAttribute("aria-pressed", String(activeValue !== null && b.getAttribute(attr) === activeValue))
      );
    }
    const normalize = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

    function applyFilters() {
      const q = normalize(state.q);
      // Nothing is listed until the visitor searches or picks a filter — the
      // featured cards above the tools are the default view of the section.
      const idle = !q && state.year === null && state.type === null;
      let shown = 0;
      for (const item of pubItems) {
        const year = item.dataset.year || "";
        const type = item.dataset.kind || "";
        const okYear = state.year === null || state.year === "all" || year === state.year;
        const okType = state.type === null || state.type === "all" || type === state.type;
        const hay = normalize(item.textContent);
        const okQ = !q || hay.includes(q);
        const show = !idle && okYear && okType && okQ;
        item.style.display = show ? "" : "none";
        if (show) shown++;
      }
      if (countEl) countEl.textContent = String(shown);
      if (emptyEl) {
        emptyEl.hidden = shown > 0;
        emptyEl.textContent = idle
          ? "Search or pick a filter to browse the full publication list."
          : "No publications match that filter.";
      }
    }
    yearBtns.forEach((b) =>
      b.addEventListener("click", () => {
        const value = b.getAttribute("data-year");
        state.year = state.year === value ? null : value;
        setPressed(yearBtns, state.year, "data-year");
        applyFilters();
      })
    );
    typeBtns.forEach((b) =>
      b.addEventListener("click", () => {
        const value = b.getAttribute("data-type");
        state.type = state.type === value ? null : value;
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

  // ---------- Header over hero ----------
  // Transparent white-on-photo bar while the hero fills the screen; solid bar after.
  const header = $(".header");
  const heroSec = $(".hero");
  if (header && heroSec) {
    const setHeaderMode = () => {
      const overHero =
        heroSec.getBoundingClientRect().bottom > header.offsetHeight + 4;
      header.classList.toggle("is-over-hero", overHero);
    };
    setHeaderMode();
    window.addEventListener("scroll", setHeaderMode, { passive: true });
    window.addEventListener("resize", setHeaderMode, { passive: true });
  }

  // ---------- Featured publication thumbnails ----------
  // Artwork is dropped into assets/pubs/ over time; show a neutral tile for
  // any file that is not there yet instead of a broken image.
  $$(".pub-card .thumb img, .project-card .thumb img").forEach((img) => {
    const markEmpty = () => img.parentElement.classList.add("is-empty");
    if (img.complete && img.naturalWidth === 0) markEmpty();
    else img.addEventListener("error", markEmpty, { once: true });
  });

  // ---------- Contact photo gallery ----------
  // Drag the strip sideways or use the arrows; the index wraps at both ends.
  const gallery = $("#reblGallery");
  if (gallery) {
    const track = $(".gallery-track", gallery);
    const slides = $$("img", track);
    let index = 0;
    let startX = 0;
    let delta = 0;
    let dragging = false;

    // Offset in px rides on top of the whole-slide percentage so the photo
    // tracks the pointer during a drag and snaps cleanly afterwards.
    const place = (offset) => {
      track.style.transform =
        "translate3d(calc(" + -index * 100 + "% + " + offset + "px), 0, 0)";
    };
    const go = (next) => {
      index = (next + slides.length) % slides.length;
      place(0);
    };

    $(".gallery-nav.prev", gallery).addEventListener("click", () => go(index - 1));
    $(".gallery-nav.next", gallery).addEventListener("click", () => go(index + 1));

    track.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      delta = 0;
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      delta = e.clientX - startX;
      place(delta);
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      const threshold = gallery.clientWidth * 0.18;
      if (delta <= -threshold) go(index + 1);
      else if (delta >= threshold) go(index - 1);
      else place(0);
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    gallery.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
    });

    place(0);
  }
  // ---------- Contact form ----------
  // The site is static, so there is no server to post to. Submitting composes
  // the message and hands it to the visitor’s mail client addressed to Amir.
  // To send server-side instead, replace the mailto hand-off below with a
  // fetch() POST to a form endpoint (Formspree, Getform, Web3Forms, …).
  const CONTACT_TO = "amir.patel@ucl.ac.uk";
  const contactForm = $("#contactForm");
  if (contactForm) {
    const note = $("#cfNote");
    let intent = "Join the Lab";
    $$("button[data-intent]", contactForm).forEach((b) =>
      b.addEventListener("click", () => {
        intent = b.getAttribute("data-intent");
      })
    );

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = (name) => (contactForm.elements[name].value || "").trim();
      const subject = "[REBL] " + intent + " — " + val("reason");
      const body = [
        "Name: " + val("name"),
        "Email: " + val("email"),
        "Organisation: " + (val("organisation") || "—"),
        "Reason for contact: " + val("reason"),
        "Enquiry type: " + intent,
        "",
        val("message"),
      ].join("\n");

      window.location.href =
        "mailto:" + CONTACT_TO +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (note) note.textContent = "Opening your email app with the message ready to send.";
      showToast("Message prepared");
    });
  }
  // ---------- Card expand/collapse ----------
  // People, featured papers, datasets and tools all share the behaviour:
  // one card open at a time within its own grid.
  const EXPANDABLE = ".person, .pub-card, .ds-card, .pi-block";
  $$(EXPANDABLE).forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const isExpanded = card.classList.contains("expanded");
      const group = card.parentElement;
      // Siblings only, so opening the PI card does not close a team card.
      $$(EXPANDABLE, group)
        .filter((c) => c.parentElement === group)
        .forEach((c) => c.classList.remove("expanded"));
      if (!isExpanded) card.classList.add("expanded");
    });
  });

  // ---------- Clip previews inside expandable cards ----------
  // The markup autoplays on its own; this only stops playback while the card
  // is shut, and restarts it from the top on the next open.
  $$(".ds-media video").forEach((video) => {
    const card = video.closest(".ds-card");
    if (!card) return;
    new MutationObserver(() => {
      if (card.classList.contains("expanded")) {
        const p = video.play();
        if (p) p.catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }).observe(card, { attributes: true, attributeFilter: ["class"] });
  });

  // ---------- Alumni disclosure ----------
  // Closed by default; the heading is the toggle. Height is measured so the
  // panel still animates correctly if a card inside it grows.
  const alumniToggle = $("#alumniToggle");
  const alumniPanel = $("#alumniPanel");
  if (alumniToggle && alumniPanel) {
    const isOpen = () => alumniPanel.classList.contains("open");
    const syncHeight = () => {
      if (isOpen()) alumniPanel.style.maxHeight = alumniPanel.scrollHeight + "px";
    };
    alumniToggle.addEventListener("click", () => {
      const open = !isOpen();
      alumniPanel.classList.toggle("open", open);
      alumniToggle.setAttribute("aria-expanded", String(open));
      alumniPanel.inert = !open;
      alumniPanel.style.maxHeight = open ? alumniPanel.scrollHeight + "px" : "0px";
    });
    const inner = $(".people-grid", alumniPanel);
    if (inner && window.ResizeObserver) new ResizeObserver(syncHeight).observe(inner);
    window.addEventListener("resize", syncHeight, { passive: true });
  }
})();
