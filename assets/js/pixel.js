const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const bootScreen = document.querySelector("[data-boot-screen]");
const progressBar = document.querySelector("[data-scroll-progress]");
const revealItems = document.querySelectorAll("[data-reveal]");
const navLinks = [...document.querySelectorAll(".pixel-nav a")];

function finishBoot() {
  bootScreen?.classList.add("is-done");
}

if (reduceMotion) {
  finishBoot();
} else {
  window.addEventListener("load", () => window.setTimeout(finishBoot, 820), { once: true });
  window.setTimeout(finishBoot, 1600);
}

function updateScrollProgress() {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = Math.min(Math.max(progress, 0), 1) * 100 + "%";
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = Math.min(index % 4, 3) * 55 + "ms";
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const pageSections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === "#" + visible.target.id;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { threshold: [0.2, 0.45], rootMargin: "-20% 0px -55%" }
  );

  pageSections.forEach((section) => navObserver.observe(section));
}
