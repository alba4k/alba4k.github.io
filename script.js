// Theme toggle (Dark / Light)
const theme_btn = document.getElementById("theme-toggle");

function getTheme() {
  const saved = localStorage.getItem("theme");
  if(saved) return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function updateThemeToggleUI(theme) {
  if(!theme_btn) return;
  const is_light = theme === "light";
  const label = is_light ? "Switch to dark mode" : "Switch to light mode";
  theme_btn.setAttribute("aria-label", label);
  theme_btn.setAttribute("title", label);
  theme_btn.setAttribute("aria-pressed", is_light ? "true" : "false");
}

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.style.colorScheme = t;
  const scheme = document.querySelector('meta[name="color-scheme"]');
  if(scheme)
    scheme.setAttribute("content", t);
  updateThemeToggleUI(t);
}

function setTheme(t) {
  applyTheme(t);
  try {
    localStorage.setItem("theme", t);
  } catch(e) {}
}

if(theme_btn) {
  updateThemeToggleUI(document.documentElement.getAttribute("data-theme") || getTheme());
  theme_btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || getTheme();
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
  });
}

// Follow browser/system theme changes if the user hasn't manually set a preference
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
  if(!localStorage.getItem("theme")) {
    applyTheme(e.matches ? "light" : "dark");
  }
});

// Footer year
const year_elem = document.getElementById("year");
if(year_elem) year_elem.textContent = new Date().getFullYear();

// Timezone
const tz_elem = document.getElementById("timezone");
function updateTime() {
  if(tz_elem) {
    // Shows dynamic local time, e.g., "14:30 CET" or "14:30 CEST"
    const now = new Date();
    const time_str = now.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Zurich",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
    tz_elem.textContent = time_str;
  }
}
updateTime()
setInterval(updateTime, 10000); // update every 10s

// Portfolio centering
const portfolioContainer = document.querySelector('.portfolio-scroll');
const projectCards = document.querySelectorAll('.project-card');

function centerPortfolioCard() {
  if (projectCards.length >= 2 && portfolioContainer) {
    const card = projectCards[1];
    const containerRect = portfolioContainer.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset = (cardRect.left + cardRect.width / 2) - (containerRect.left + containerRect.width / 2);
    if (Math.abs(offset) > 1) {
      portfolioContainer.scrollLeft += offset;
    }
  }
}

centerPortfolioCard();
window.addEventListener('DOMContentLoaded', centerPortfolioCard);
window.addEventListener('load', centerPortfolioCard);

window.addEventListener("keydown", (e) => {
  if(e.key === "ArrowRight") {
    document.querySelector(".portfolio-scroll")?.scrollBy({left: 200, behavior: "smooth"});
  } else if(e.key === "ArrowLeft") {
    document.querySelector(".portfolio-scroll")?.scrollBy({left: -200, behavior: "smooth"});
  }
});

// Scroll-reveal: fade+blur elements in as they enter the viewport
const revealEls = document.querySelectorAll("[data-reveal]");

function revealElement(el, index = 0) {
  if (!el.classList.contains("is-visible")) {
    el.style.transitionDelay = `${(index % 5) * 80}ms`;
    el.classList.add("is-visible");
    setTimeout(() => {
      el.style.transitionDelay = "";
    }, 1000);
  }
}

if("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          revealElement(entry.target, i);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  revealEls.forEach((el) => io.observe(el));

  // Check visibility for cards within portfolio horizontal scroll
  const checkPortfolioCards = () => {
    if (!portfolioContainer) return;
    const contRect = portfolioContainer.getBoundingClientRect();
    portfolioContainer.querySelectorAll('.project-card[data-reveal]:not(.is-visible)').forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const inContainer = rect.right > contRect.left && rect.left < contRect.right;
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inContainer && inViewport) {
        revealElement(card, i);
        io.unobserve(card);
      }
    });
  };

  portfolioContainer?.addEventListener('scroll', checkPortfolioCards, { passive: true });

  // Initial check to ensure all elements partially visible on load are rendered immediately
  const checkInitialVisible = () => {
    checkPortfolioCards();
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      if (inViewport) {
        const parentScroll = el.closest('.portfolio-scroll');
        if (parentScroll) {
          const contRect = parentScroll.getBoundingClientRect();
          if (rect.right <= contRect.left || rect.left >= contRect.right) return;
        }
        revealElement(el, i);
        io.unobserve(el);
      }
    });
  };

  checkInitialVisible();
  window.addEventListener('DOMContentLoaded', checkInitialVisible);
  window.addEventListener('load', checkInitialVisible);
} else {
  // Fallback: just show everything
  revealEls.forEach((el) => revealElement(el));
}

// Scroll cue button
document.getElementById("scrollCue")?.addEventListener("click", () => {
  document.getElementById("links")?.scrollIntoView({ behavior: "smooth" });
});

// Subtle cursor-parallax on the background blobs (skipped if reduced motion is on)
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if(!prefersReduced) {
  const blobs = document.querySelectorAll(".blob");
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    blobs.forEach((blob, i) => {
      blob.style.translate = `${x * (i + 1)}px ${y * (i + 1)}px`;
    });
  });
}
