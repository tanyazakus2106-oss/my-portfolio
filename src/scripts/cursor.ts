// Custom cursor — dot + hover blob. Inspired by cedricith.com/work.
// Disabled for reduced-motion, touch, and coarse-pointer environments.
// Reverse path: see .planning/quick/260506-cur-cursor-effect/260506-cur-PLAN.md.

const HOVER_SELECTOR =
  'a, button, [role="button"], .featured-card, .project-card';

const DOT_LERP = 0.35;
const BLOB_LERP = 0.18;

function initCustomCursor(): void {
  if (typeof window === 'undefined') return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const fineHover =
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !fineHover) return;

  const root = document.querySelector<HTMLElement>('.custom-cursor');
  const dot = document.querySelector<HTMLElement>('.custom-cursor .cursor-dot');
  const blob = document.querySelector<HTMLElement>(
    '.custom-cursor .cursor-blob'
  );
  if (!root || !dot || !blob) return;

  const target = { x: 0, y: 0 };
  const dotPos = { x: 0, y: 0 };
  const blobPos = { x: 0, y: 0 };
  let seeded = false;
  let rafId = 0;

  const tick = (): void => {
    dotPos.x += (target.x - dotPos.x) * DOT_LERP;
    dotPos.y += (target.y - dotPos.y) * DOT_LERP;
    blobPos.x += (target.x - blobPos.x) * BLOB_LERP;
    blobPos.y += (target.y - blobPos.y) * BLOB_LERP;
    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
    blob.style.transform = `translate3d(${blobPos.x}px, ${blobPos.y}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent): void => {
    target.x = e.clientX;
    target.y = e.clientY;
    if (!seeded) {
      dotPos.x = blobPos.x = target.x;
      dotPos.y = blobPos.y = target.y;
      seeded = true;
      document.body.setAttribute('data-cursor-ready', '');
      rafId = requestAnimationFrame(tick);
    }
  };

  const onOver = (e: PointerEvent): void => {
    const t = e.target as Element | null;
    if (t && t.closest && t.closest(HOVER_SELECTOR)) {
      document.body.setAttribute('data-cursor-state', 'hover');
    }
  };

  const onOut = (e: PointerEvent): void => {
    const t = e.target as Element | null;
    const related = e.relatedTarget as Element | null;
    if (
      t &&
      t.closest &&
      t.closest(HOVER_SELECTOR) &&
      !(related && related.closest && related.closest(HOVER_SELECTOR))
    ) {
      document.body.removeAttribute('data-cursor-state');
    }
  };

  const onLeaveWindow = (): void => {
    document.body.removeAttribute('data-cursor-ready');
    document.body.removeAttribute('data-cursor-state');
  };

  const onEnterWindow = (): void => {
    if (seeded) document.body.setAttribute('data-cursor-ready', '');
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.addEventListener('mouseleave', onLeaveWindow);
  document.addEventListener('mouseenter', onEnterWindow);

  // Stop the rAF loop if tab is hidden — saves cycles in background.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else if (seeded) {
      rafId = requestAnimationFrame(tick);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
  initCustomCursor();
}
