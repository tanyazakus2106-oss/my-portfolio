// Shared scroll-entrance animation — home project cards, about sections, and the
// case-study body. D-18 to D-23, WORK-06, POL-01.
//
// Opt-in forms:
//   .animate-on-scroll     class opt-in (FeaturedCard, ProjectCard, about.astro)
//   [data-reveal]          attribute opt-in, for any single element
//   [data-reveal-group]    container whose direct children are chunked into
//                          SECTIONS — each section reveals as one unit
//
// Sections, not elements. A section is a run of sibling elements starting at a
// heading and continuing until the next boundary, so "Main Pain Points" and its
// paragraph and its three cards all appear together rather than trickling in
// one at a time. Boundaries are h2/h3/h4, <details> (CaseAccordion renders one,
// and carries its own heading), and any explicit [data-reveal].
//
// No wrapper elements: .case-prose is a CSS grid relying on auto-placement over
// flat MDX output (h2 → col 1, everything else → col 2), so wrapping runs in
// divs would break the layout. display:contents would preserve it but cannot be
// animated — opacity and transform do not apply to contents boxes. A section is
// therefore just an array of siblings sharing one observed leader.
//
// Stagger is batch-scoped and applies BETWEEN sections, not inside them:
// everything revealed in a single observer callback is sorted top-to-bottom and
// given --stagger-index 0,1,2…, reset on the next callback. A running global
// counter would accrue seconds of delay by the bottom of a long case study.
//
// Reduced motion is honoured by bailing before the observer is wired, with a CSS
// backstop in global.css.

const REVEAL_SELECTOR = ".animate-on-scroll, [data-reveal]";
const GROUP_SELECTOR = "[data-reveal-group]";
const SECTION_BOUNDARY = "h2, h3, h4, details, [data-reveal]";
const VISIBLE_CLASS = "is-visible";

// Module-scoped so re-initialisation (astro:page-load) reuses one observer
// rather than leaking a new one per navigation.
let observer: IntersectionObserver | null = null;

// Leader element → the full run of siblings it reveals.
const sectionOf = new Map<Element, HTMLElement[]>();

function splitIntoSections(group: HTMLElement): HTMLElement[][] {
  const sections: HTMLElement[][] = [];
  let current: HTMLElement[] = [];

  for (const child of Array.from(group.children) as HTMLElement[]) {
    // A boundary closes the run before it, so a heading always leads its own
    // section rather than trailing the previous one.
    if (child.matches(SECTION_BOUNDARY) && current.length > 0) {
      sections.push(current);
      current = [];
    }
    current.push(child);
  }
  if (current.length > 0) sections.push(current);

  return sections;
}

function collectSections(): HTMLElement[][] {
  const inGroup = new Set<HTMLElement>();
  const sections: HTMLElement[][] = [];

  document.querySelectorAll<HTMLElement>(GROUP_SELECTOR).forEach((group) => {
    splitIntoSections(group).forEach((section) => {
      section.forEach((el) => inGroup.add(el));
      sections.push(section);
    });
  });

  // Standalone opt-ins outside any group are one-element sections, so home
  // cards and about blocks flow through the same path.
  document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
    if (!inGroup.has(el)) sections.push([el]);
  });

  return sections;
}

function revealSection(leader: Element, staggerIndex: number): void {
  const section = sectionOf.get(leader);
  if (!section) return;

  section.forEach((el) => {
    // One index for the whole section — members appear together.
    el.style.setProperty("--stagger-index", String(staggerIndex));
    el.classList.add(VISIBLE_CLASS);

    // Release the compositor hint once the transition lands — a permanent
    // will-change across dozens of elements costs memory for no benefit.
    el.addEventListener(
      "transitionend",
      () => {
        el.style.willChange = "auto";
      },
      { once: true },
    );
  });

  sectionOf.delete(leader);
}

function initScrollAnimation(): void {
  // Signal to the inline head script's failsafe that the module is alive, before
  // any early return — pages with no targets must not have .js-reveal stripped
  // mid-session.
  document.documentElement.dataset.revealReady = "1";

  // Idempotent: only bind sections whose leader this run has not already
  // claimed, so wiring both DOMContentLoaded and astro:page-load cannot
  // double-observe or re-hide something already revealed.
  const sections = collectSections().filter(
    (section) => !section[0].dataset.revealBound,
  );
  if (sections.length === 0) return;

  sections.forEach((section) => {
    section[0].dataset.revealBound = "1";
    sectionOf.set(section[0], section);
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    sections.flat().forEach((el) => el.classList.add(VISIBLE_CLASS));
    return;
  }

  observer ??= new IntersectionObserver(
    (entries) => {
      // Callback entries arrive in registration order, not visual order — sort
      // by viewport position so the stagger always reads top to bottom.
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      entering.forEach((entry, i) => {
        revealSection(entry.target, i);
        observer?.unobserve(entry.target); // fire once, never re-hide
      });
    },
    {
      // threshold 0 + a bottom rootMargin trim fires when the leader's top edge
      // rises 15% above the viewport bottom. Element-ratio thresholds cannot do
      // this for targets taller than the viewport (full-bleed images), which
      // would never reach the ratio.
      threshold: 0,
      rootMargin: `0px 0px -15% 0px`,
    },
  );

  sections.forEach((section) => observer?.observe(section[0]));

  // Fallback for the zoom edge case where IntersectionObserver never fires
  // (see quick task 260506-zm1). After 2.5s reveal only sections whose leader is
  // ACTUALLY in the viewport — below-fold sections must stay hidden so they
  // still animate one by one when scrolled to, rather than being silently
  // revealed while the visitor lingers on the hero.
  setTimeout(() => {
    const viewportHeight = window.innerHeight;
    const stranded = sections.filter(([leader]) => {
      if (leader.classList.contains(VISIBLE_CLASS)) return false;
      const rect = leader.getBoundingClientRect();
      return rect.top < viewportHeight && rect.bottom > 0;
    });
    stranded.forEach(([leader], i) => {
      revealSection(leader, i);
      observer?.unobserve(leader);
    });
  }, 2500);
}

function onReady(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollAnimation, {
      once: true,
    });
  } else {
    initScrollAnimation();
  }
}

onReady();

// Re-run after a ClientRouter navigation. The site does not currently mount
// <ClientRouter />, so this never fires today — it is wired so enabling view
// transitions later does not silently break reveals.
document.addEventListener("astro:page-load", initScrollAnimation);
