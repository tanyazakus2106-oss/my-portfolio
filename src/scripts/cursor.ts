// Custom cursor — single ringed dot follows the mouse. No hover state.
// Disabled for reduced-motion, touch, and coarse-pointer environments.
// Reverse path: see .planning/quick/260506-cur-cursor-effect/260506-cur-PLAN.md.

const DOT_LERP = 0.35;

function initCustomCursor(): void {
  if (typeof window === 'undefined') return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const fineHover =
    window.matchMedia('(hover: hover)').matches &&
    window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !fineHover) return;

  const dot = document.querySelector<HTMLElement>('.custom-cursor .cursor-dot');
  if (!dot) return;

  const target = { x: 0, y: 0 };
  const dotPos = { x: 0, y: 0 };
  let seeded = false;
  let rafId = 0;

  const tick = (): void => {
    dotPos.x += (target.x - dotPos.x) * DOT_LERP;
    dotPos.y += (target.y - dotPos.y) * DOT_LERP;
    dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent): void => {
    target.x = e.clientX;
    target.y = e.clientY;
    if (!seeded) {
      dotPos.x = target.x;
      dotPos.y = target.y;
      seeded = true;
      document.body.setAttribute('data-cursor-ready', '');
      rafId = requestAnimationFrame(tick);
    }
  };

  const onLeaveWindow = (): void => {
    document.body.removeAttribute('data-cursor-ready');
  };

  const onEnterWindow = (): void => {
    if (seeded) document.body.setAttribute('data-cursor-ready', '');
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeaveWindow);
  document.addEventListener('mouseenter', onEnterWindow);

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
