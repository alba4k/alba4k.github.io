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

window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');
  if(cards.length >= 2) {
    cards[1].scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'instant'
    });
  }
  
});
window.addEventListener("keydown", (e) => {
  if(e.key === "ArrowRight") {
    document.querySelector(".portfolio-scroll")?.scrollBy({left: 350, behavior: "smooth"});
  } else if(e.key === "ArrowLeft") {
    document.querySelector(".portfolio-scroll")?.scrollBy({left: -350, behavior: "smooth"});
  }
});

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
