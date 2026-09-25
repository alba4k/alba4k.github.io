// Footer year
const yearEl = document.getElementById("year");
if(yearEl) yearEl.textContent = new Date().getFullYear();

const tzEl = document.getElementById("timezone");
if(tzEl) {
  // Shows dynamic local time, e.g., "14:30 CET" or "14:30 CEST"
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-GB", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });
  tzEl.textContent = timeStr;
}

// Scroll-reveal: fade+blur elements in as they enter the viewport
const revealEls = document.querySelectorAll("[data-reveal]");
if("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(i % 5) * 80}ms`;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  // Fallback: just show everything
  revealEls.forEach((el) => el.classList.add("is-visible"));
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
      // Uses the standalone `translate` property so it composites
      // with the CSS keyframe animation's `transform` instead of fighting it.
      blob.style.translate = `${x * (i + 1)}px ${y * (i + 1)}px`;
    });
  });
}
