// Shared scroll-entrance animation — used by home-page project cards and case-study sections.
// Respects prefers-reduced-motion via the CSS @media block in global.css.
// D-18 to D-23, WORK-06, POL-01.

const STAGGER_STEP_MS = 60; // Within D-21 range (50–80ms).

function initScrollAnimation(): void {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = document.querySelectorAll<HTMLElement>('.animate-on-scroll');
  if (targets.length === 0) return;

  // If reduced motion: reveal immediately, skip observer wiring entirely.
  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Assign stagger index in DOM order so cards cascade in.
  targets.forEach((el, i) => {
    el.style.setProperty('--stagger-index', String(i));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px 0px 0px',
    }
  );

  targets.forEach((el) => observer.observe(el));

  // Fallback: if any element is still hidden after 2.5s (e.g. at zoom levels
  // where IntersectionObserver never fires), reveal it.
  setTimeout(() => {
    targets.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  }, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimation);
} else {
  initScrollAnimation();
}
