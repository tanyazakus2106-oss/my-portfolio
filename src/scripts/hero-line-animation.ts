// Group .animate-line-word spans inside [data-line-group] containers by visual line
// (shared top position), then assign --line-index per line. Adds .is-ready to gate
// the animation until measurement completes, avoiding a flash where every word would
// briefly share the default --line-index: 0.
// Respects prefers-reduced-motion via the @media block in src/styles/global.css.

const TOP_TOLERANCE_PX = 2;

function initLineAnimation(): void {
  const groups = document.querySelectorAll<HTMLElement>("[data-line-group]");
  groups.forEach((group) => {
    const words = group.querySelectorAll<HTMLElement>(".animate-line-word");
    let currentTop: number | null = null;
    let lineIndex = -1;
    words.forEach((word) => {
      const top = word.getBoundingClientRect().top;
      if (
        currentTop === null ||
        Math.abs(top - currentTop) > TOP_TOLERANCE_PX
      ) {
        currentTop = top;
        lineIndex += 1;
      }
      word.style.setProperty("--line-index", String(lineIndex));
      word.classList.add("is-ready");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(initLineAnimation);
  });
} else {
  requestAnimationFrame(initLineAnimation);
}
