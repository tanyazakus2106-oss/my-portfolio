// Lenis smooth-scroll — EVALUATION PROTOTYPE, wired site-wide via BaseLayout.
// Tuned to approximate the scroll feel of yrmn.me: Lenis default exponential
// ease-out with duration ~1.0s. Guarded by prefers-reduced-motion — when the
// user requests reduced motion, Lenis is NOT initialized and native scrolling
// stays fully intact. Remove this file + the BaseLayout <script> hookup to revert.

import Lenis from "lenis";
import "lenis/dist/lenis.css";

function initSmoothScroll(): void {
  // Do not smooth-scroll for users who asked to reduce motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // autoRaf runs Lenis's internal requestAnimationFrame loop.
  new Lenis({
    duration: 1.0,
    autoRaf: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothScroll);
} else {
  initSmoothScroll();
}
