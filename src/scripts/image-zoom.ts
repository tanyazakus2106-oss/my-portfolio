// Click-to-zoom for case-study body images (any <img data-zoomable>), in the
// medium-zoom style: the image travels from its spot in the prose column to
// viewport center over a theme-colored backdrop. Second click, Escape, scroll,
// or resize dismisses it.
//
// The zoomed view is a fixed-position CLONE appended to <body> — the original
// can sit inside CaseAccordion's ::details-content, whose overflow clip would
// cut off an in-place transform. The backdrop uses --color-background so it
// tracks light/dark theme automatically. Reduced motion gets an instant swap
// with no travel animation.

const ZOOM_MARGIN = 40; // px of viewport breathing room around the zoomed image
const DURATION_MS = 300;
const EASING = "cubic-bezier(0.2, 0, 0.2, 1)";

interface ActiveZoom {
  source: HTMLImageElement;
  clone: HTMLImageElement;
  backdrop: HTMLDivElement;
  dispose: () => void;
}

let active: ActiveZoom | null = null;

const reducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function openZoom(source: HTMLImageElement): void {
  if (active) return;

  const rect = source.getBoundingClientRect();
  const scale = Math.max(
    1,
    Math.min(
      (window.innerWidth - ZOOM_MARGIN * 2) / rect.width,
      (window.innerHeight - ZOOM_MARGIN * 2) / rect.height,
    ),
  );
  const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
  const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

  const instant = reducedMotion();

  const backdrop = document.createElement("div");
  backdrop.style.cssText = `position: fixed; inset: 0; z-index: 70; background: var(--color-background); opacity: 0; cursor: zoom-out;`;
  if (!instant)
    backdrop.style.transition = `opacity ${DURATION_MS}ms ${EASING}`;

  const clone = source.cloneNode() as HTMLImageElement;
  clone.removeAttribute("data-zoomable");
  clone.removeAttribute("role");
  clone.removeAttribute("tabindex");
  clone.removeAttribute("aria-label");
  clone.sizes = "100vw"; // let srcset pick a sharper candidate at zoom size
  clone.style.cssText = `position: fixed; top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px; margin: 0; z-index: 71; cursor: zoom-out; will-change: transform;`;
  if (!instant) clone.style.transition = `transform ${DURATION_MS}ms ${EASING}`;

  document.body.append(backdrop, clone);
  // Keep the original occupying its layout slot but visually absent. Opacity
  // (not visibility) so it stays focusable and Enter/Space can close again.
  source.style.opacity = "0";

  // Double rAF: the clone must paint once at the source rect before the
  // travel transition starts, or it pops straight to the zoomed state.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdrop.style.opacity = "0.94";
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    });
  });

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeZoom();
  };
  const onDismiss = () => closeZoom();
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("scroll", onDismiss, { passive: true });
  window.addEventListener("resize", onDismiss);
  backdrop.addEventListener("click", onDismiss);
  clone.addEventListener("click", onDismiss);

  active = {
    source,
    clone,
    backdrop,
    dispose: () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("scroll", onDismiss);
      window.removeEventListener("resize", onDismiss);
    },
  };
}

function closeZoom(): void {
  if (!active) return;
  const { source, clone, backdrop, dispose } = active;
  active = null;
  dispose();

  const finish = () => {
    source.style.opacity = "";
    clone.remove();
    backdrop.remove();
  };

  if (reducedMotion()) {
    finish();
    return;
  }
  backdrop.style.opacity = "0";
  clone.style.transform = "";
  // setTimeout over transitionend: the travel can be interrupted mid-flight
  // (rapid toggling), where transitionend never fires for the retargeted run.
  window.setTimeout(finish, DURATION_MS);
}

function initImageZoom(): void {
  document
    .querySelectorAll<HTMLImageElement>("img[data-zoomable]")
    .forEach((img) => {
      img.style.cursor = "zoom-in";
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Zoom image: ${img.alt}`);
      const toggle = () =>
        active?.source === img ? closeZoom() : openZoom(img);
      img.addEventListener("click", toggle);
      img.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initImageZoom);
} else {
  initImageZoom();
}
