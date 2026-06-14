// Shared scroll-entrance animation — used by home-page project cards and case-study sections.
// Respects prefers-reduced-motion via the CSS @media block in global.css.
// D-18 to D-23, WORK-06, POL-01.
//
// Reveal model: each target fades+rises in as it enters the viewport. Stagger
// delay (--stagger-index × 70ms in global.css) is reserved for the cluster of
// targets already on-screen at load, so the first screen cascades. Everything
// below the fold gets --stagger-index: 0 and reveals immediately when scrolled
// to — the scroll position provides the "one by one" rhythm, with no accrued
// delay that would make lower cards feel laggy.

function initScrollAnimation(): void {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targets = document.querySelectorAll<HTMLElement>(".animate-on-scroll");
  if (targets.length === 0) return;

  // If reduced motion: reveal immediately, skip observer wiring entirely.
  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Read phase: which targets are within the initial viewport at load?
  const viewportHeight = window.innerHeight;
  const inInitialView = Array.from(targets).map((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < viewportHeight && rect.bottom > 0;
  });

  // Write phase: stagger the initial-view cluster in DOM order; below-fold
  // targets reveal with no delay so each tracks the scroll individually.
  let initialIndex = 0;
  targets.forEach((el, i) => {
    el.style.setProperty(
      "--stagger-index",
      String(inInitialView[i] ? initialIndex++ : 0),
    );
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0,
      // Trigger once the target has risen ~16% above the viewport's bottom edge,
      // so each card reveals once it is comfortably into view.
      rootMargin: "0px 0px -16% 0px",
    },
  );

  targets.forEach((el) => observer.observe(el));

  // Fallback for the zoom edge case where IntersectionObserver never fires:
  // after 2.5s, reveal only targets that are ACTUALLY in the viewport. Below-fold
  // targets must stay hidden so they still animate one-by-one when scrolled to —
  // otherwise a visitor who lingers on the hero would have every card silently
  // revealed before they ever scroll down.
  setTimeout(() => {
    const vh = window.innerHeight;
    targets.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < vh && rect.bottom > 0;
      if (inView) {
        el.classList.add("is-visible");
        observer.unobserve(el);
      }
    });
  }, 2500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollAnimation);
} else {
  initScrollAnimation();
}
