/* ============================================================
   REBL — vanilla JS enhancements
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = document.documentElement;

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

  // ---------- Header over the page's opening band ----------
  // Two kinds of band open a page: the hero photograph on home, and the
  // near-black intro on Projects, Join and Contact. Both want the same bar —
  // no fill, white type — while they are still under it, and the solid warm
  // bar once they have scrolled away. Pages without either (Research runs on
  // the dark ground the whole way down, Team and Outputs on the warm one)
  // find no band and keep the solid bar throughout.
  const header = $(".header");
  let setHeaderMode = () => {};
  if (header) {
    setHeaderMode = () => {
      const hero = $(".hero.is-active");
      const band = hero || $(".page.is-active .page-intro");
      let overBand = false;
      if (band) {
        const rect = band.getBoundingClientRect();
        // Transparent only while resting at the top of the band. Once the page
        // scrolls — which on home it now does, to reach the footer — the hero
        // copy slides up behind the bar, and a transparent bar would let the
        // headline collide with the lockup instead of passing under it.
        overBand = rect.bottom > header.offsetHeight + 4 && rect.top > -4;
      }
      header.classList.toggle("is-over-hero", overBand && !!hero);
      header.classList.toggle("is-over-dark", overBand && !hero);
    };
    // Inner pages start below the fixed bar; the mobile nav panel hangs off it too.
    const setHeaderHeight = () =>
      root.style.setProperty("--header-h", header.offsetHeight + "px");
    setHeaderHeight();
    setHeaderMode();
    window.addEventListener("scroll", setHeaderMode, { passive: true });
    window.addEventListener("resize", () => {
      setHeaderHeight();
      setHeaderMode();
    }, { passive: true });
  }

  // ---------- Page router ----------
  // The nav swaps which section is mounted instead of scrolling one long page.
  // The hash is the address, so deep links and the back button both work.
  const pages = $$("main > section[id]");
  const pageIds = new Set(pages.map((p) => p.id));
  // The footer carries News and Home, so it takes the current-page mark too.
  const navLinks = $$(".nav a[href^='#'], .footer-nav a[href^='#']");
  const HOME = "home";
  // Links from before People and Publications were renamed still land correctly.
  const ALIASES = { people: "team", publications: "outputs", news: "team" };
  // Pages that run on the near-black ground from top to bottom. Projects, Join
  // and Contact stay on the warm ground and open on a dark .page-intro band
  // instead, which is styling, not a theme. Mirrored by the boot script in the
  // document head so a deep link paints the right ground on the first frame.
  const DARK_PAGES = new Set(["research"]);

  const pageFromHash = () => {
    const raw = (location.hash || "").slice(1);
    const id = ALIASES[raw] || raw;
    return pageIds.has(id) ? id : HOME;
  };

  function showPage(id) {
    const target = pageIds.has(id) ? id : HOME;
    // Keep the address honest after an alias or an unknown hash.
    if (location.hash && location.hash !== "#" + target) {
      history.replaceState(null, "", "#" + target);
    }
    pages.forEach((p) => p.classList.toggle("is-active", p.id === target));
    navLinks.forEach((a) => {
      if (a.getAttribute("href") === "#" + target) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    root.setAttribute("data-theme", DARK_PAGES.has(target) ? "night" : "day");
    // Kept as a styling hook for anything that needs to know the hero is up.
    document.body.classList.toggle("on-home", target === HOME);
    window.scrollTo(0, 0);
    setHeaderMode();
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href");
    // Placeholder links (the thesis PDFs) must not fall through to the router,
    // which would read the empty hash as "go home".
    if (href === "#") {
      e.preventDefault();
      return;
    }
    const id = href.slice(1);
    if (!pageIds.has(id)) return;
    e.preventDefault();
    if (nav) nav.classList.remove("open");
    menuBtn && menuBtn.setAttribute("aria-expanded", "false");
    if (pageFromHash() === id) {
      window.scrollTo(0, 0);
      return;
    }
    // hashchange does the actual swap, so history stays in step.
    location.hash = "#" + id;
  });

  window.addEventListener("hashchange", () => showPage(pageFromHash()));
  showPage(pageFromHash());

  // ---------- Featured publication thumbnails ----------
  // Artwork is dropped into assets/pubs/ over time; show a neutral tile for
  // any file that is not there yet instead of a broken image.
  $$(".pub-card .thumb img, .project-card .thumb img, .robot-photo img").forEach((img) => {
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
  // People, projects, featured papers, datasets and tools all share the
  // behaviour: one card open at a time within its own grid.
  const EXPANDABLE = ".person, .pub-card, .ds-card, .project-card, .pi-block";
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
      // offsetParent is null while the People page is unmounted, when every
      // height measures 0 — re-measuring then would collapse an open panel.
      if (isOpen() && alumniPanel.offsetParent) {
        alumniPanel.style.maxHeight = alumniPanel.scrollHeight + "px";
      }
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
