/* ============================================================
   THEME TOGGLE  (light / dark)
   ============================================================ */
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved === "dark" || (!saved && prefersDark)) {
    root.setAttribute("data-theme", "dark");
  }

  function toggleTheme() {
    const isDark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  }

  document.querySelectorAll("#theme-toggle, #theme-toggle-mobile").forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });
})();

/* ============================================================
   HAMBURGER MENU TOGGLE
   ============================================================ */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/* ============================================================
   SCROLL PROGRESS BAR & NAV SHRINK
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  const desktopNav = document.getElementById("desktop-nav");
  const mobileNav  = document.getElementById("hamburger-nav");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    
    // Progress bar
    if (bar) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
    }

    // Nav shrink
    if (scrolled > 50) {
      if (desktopNav) desktopNav.classList.add("scrolled");
      if (mobileNav)  mobileNav.classList.add("scrolled");
    } else {
      if (desktopNav) desktopNav.classList.remove("scrolled");
      if (mobileNav)  mobileNav.classList.remove("scrolled");
    }
  }, { passive: true });
})();

/* ============================================================
   CURSOR GLOW  (desktop only)
   ============================================================ */
(function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || window.matchMedia("(pointer: coarse)").matches) {
    if (glow) glow.style.display = "none";
    return;
  }
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  }, { passive: true });
})();

/* ============================================================
   TYPEWRITER EFFECT — hero role
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const lines = [
    ".NET & Laravel Software Developer",
    "Full-Stack Web Developer",
    "C# · PHP · React · Firebase",
    "Azure Certified · Oracle Java SE 8",
  ];

  let lineIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pauseMs  = 0;

  function tick() {
    const current = lines[lineIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseMs  = 1800; // hold before deleting
      } else {
        pauseMs = 60 + Math.random() * 40;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx  = (lineIdx + 1) % lines.length;
        pauseMs  = 320;
      } else {
        pauseMs = 30 + Math.random() * 20;
      }
    }
    setTimeout(tick, pauseMs);
  }

  setTimeout(tick, 900); // start after hero fade-in
})();

/* ============================================================
   BUTTON RIPPLE
   ============================================================ */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.top  = (e.clientY - rect.top)  + "px";
    ripple.style.left = (e.clientX - rect.left) + "px";
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

/* ============================================================
   3-D TILT + MOUSE-FOLLOW CARD GLOW
   Applied to: .about-card, .skill-card, .project-card,
               .cert-card, .timeline-item
   ============================================================ */
(function initTilt() {
  const MAX_TILT  = 8;   // degrees
  const PERSP     = 900; // px

  const selectors = [
    ".about-card",
    ".skill-card",
    ".project-card",
    ".cert-card",
    ".timeline-item",
  ];

  document.querySelectorAll(selectors.join(", ")).forEach((card) => {
    card.classList.add("tilt-card");

    // Inject glow layer
    const glow = document.createElement("div");
    glow.classList.add("card-glow");
    card.style.position = "relative";
    card.appendChild(glow);

    card.addEventListener("mousemove", (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = (e.clientX - rect.left) / rect.width;   // 0-1
      const cy     = (e.clientY - rect.top)  / rect.height;  // 0-1
      const tiltX  = (cy - 0.5) * -MAX_TILT;
      const tiltY  = (cx - 0.5) *  MAX_TILT;

      card.style.transform =
        `perspective(${PERSP}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.025)`;

      // Move inner glow
      glow.style.setProperty("--mx", (cx * 100) + "%");
      glow.style.setProperty("--my", (cy * 100) + "%");
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ============================================================
   MAGNETIC SOCIAL ICONS
   ============================================================ */
(function initMagneticIcons() {
  document.querySelectorAll(".hero-socials .icon").forEach((icon) => {
    icon.addEventListener("mousemove", (e) => {
      const rect = icon.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.35;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.35;
      icon.style.transform = `translate(${dx}px, ${dy}px) scale(1.2)`;
    });
    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "";
    });
  });
})();

/* ============================================================
   ACTIVE NAV HIGHLIGHT — highlights link matching visible section
   ============================================================ */
(function initActiveNav() {
  const links    = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ============================================================
   SECTION TITLE UNDERLINE on scroll
   ============================================================ */
(function initTitleReveal() {
  const titles = document.querySelectorAll(".section-title");
  if (!("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
    }),
    { threshold: 0.4 }
  );
  titles.forEach((t) => obs.observe(t));
})();

/* ============================================================
   STAGGERED SCROLL REVEAL
   Cards and timeline items enter with staggered delays
   ============================================================ */
(function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;

  /* -- Sections fade in -- */
  document.querySelectorAll("section").forEach((el) => {
    el.style.opacity = "0";
    el.classList.add("reveal");
  });

  /* -- Cards pop in with stagger -- */
  [
    { sel: ".project-card",  cls: "reveal-pop"   },
    { sel: ".cert-card",     cls: "reveal-pop"   },
    { sel: ".skill-card",    cls: "reveal"        },
    { sel: ".timeline-item", cls: "reveal-left"   },
    { sel: ".about-card",    cls: "reveal-right"  },
  ].forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.style.opacity = "0";
      el.classList.add(cls);
    });
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = (el.dataset.revealDelay || 0) + "s";
        el.style.animationDelay = delay;
        el.classList.add("revealed");
        el.style.opacity = "";        // let animation control opacity
        obs.unobserve(el);
      });
    },
    { threshold: 0.10 }
  );

  document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-pop"
  ).forEach((el, i) => {
    // Stagger siblings by 80ms each
    const siblings = Array.from(el.parentElement?.children ?? []);
    const idx      = siblings.indexOf(el);
    if (idx > 0) el.dataset.revealDelay = (idx * 0.08).toFixed(2);
    obs.observe(el);
  });
})();

/* ============================================================
   SPACE + TECH HYBRID BACKGROUND
   Features:
   - Interactive Constellation Canvas (Tech Nodes / Matrix Links)
   - Cyber Grid perspective overlay
   - Floating Code Glyphs & Tech Symbols
   - Twinkling Space Stars
   - Shooting Meteors
   ============================================================ */
(function initSpaceTechBackground() {
  let bg = document.getElementById("star-bg");
  if (!bg) {
    bg = document.createElement("div");
    bg.id = "star-bg";
    document.body.prepend(bg);
  }

  // 1. Interactive Constellation Canvas
  const canvas = document.createElement("canvas");
  canvas.id = "space-tech-canvas";
  bg.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(Math.floor(window.innerWidth / 25), 55);
  const nodes = [];
  let mouse = { x: -1000, y: -1000 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 0.8,
    });
  }

  function getAccentRgb() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    return isDark ? [148, 163, 184] : [55, 65, 81];
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, width, height);
    const [r, g, b] = getAccentRgb();

    for (let i = 0; i < nodes.length; i++) {
      let n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Draw node dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
      ctx.fill();

      // Connect nodes to nearby nodes (Cyber Constellation Mesh)
      for (let j = i + 1; j < nodes.length; j++) {
        let n2 = nodes[j];
        let dx = n.x - n2.x;
        let dy = n.y - n2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - dist / 110) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect nodes to mouse
      let mdx = n.x - mouse.x;
      let mdy = n.y - mouse.y;
      let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 140) {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - mdist / 140) * 0.28})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(drawCanvas);
  }

  drawCanvas();

  // 3. Floating Tech Code Glyphs
  const glyphList = [
    "</>", "{...}", "0101", "[NET]", "C#", "SQL", "PHP",
    "=>", "async", "React", "1010", "&&", "git", "fn()", "0x3F", "class"
  ];

  for (let i = 0; i < 18; i++) {
    const glyph = document.createElement("div");
    glyph.classList.add("tech-glyph");
    glyph.textContent = glyphList[i % glyphList.length];

    const dur = (Math.random() * 12 + 16).toFixed(2);
    const delay = (Math.random() * 15).toFixed(2);
    const left = (Math.random() * 92 + 2).toFixed(1);

    glyph.style.left = left + "%";
    glyph.style.setProperty("--dur", dur + "s");
    glyph.style.setProperty("--delay", delay + "s");

    bg.appendChild(glyph);
  }

  // 4. Twinkling Space Stars
  const STAR_COUNT = 60;
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const size = Math.random() * 2.2 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      opacity:${(Math.random() * 0.35 + 0.12).toFixed(2)};
      animation-delay:${(Math.random() * 4).toFixed(2)}s;
    `;
    bg.appendChild(star);
  }

  // 5. Shooting Meteors
  const METEOR_COUNT = 4;
  for (let i = 0; i < METEOR_COUNT; i++) {
    const meteor = document.createElement("div");
    meteor.classList.add("meteor");
    meteor.style.cssText = `
      top:${Math.random() * 40}%;
      left:${(Math.random() * 70 + 10).toFixed(1)}%;
      height:${Math.floor(Math.random() * 60 + 40)}px;
      animation-duration:${(Math.random() * 3 + 3).toFixed(2)}s;
      animation-delay:${(Math.random() * 6).toFixed(2)}s;
    `;
    bg.appendChild(meteor);
  }
})();

/* ============================================================
   FLOATING SKILL PILLS
   ============================================================ */
(function initFloatingPills() {
  document.querySelectorAll(".skill-pill").forEach((pill) => {
    pill.classList.add("floating");
    // random duration between 2.5s and 4.5s
    const dur = (Math.random() * 2 + 2.5).toFixed(2);
    // random delay up to 2s to stagger the wave
    const delay = (Math.random() * -2).toFixed(2);
    pill.style.setProperty("--dur", dur + "s");
    pill.style.setProperty("--delay", delay + "s");
  });
})();