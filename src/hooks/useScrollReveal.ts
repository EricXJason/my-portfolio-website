import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — Intersection Observer hook for GPU-safe scroll animations.
 *
 * WHY: Drives all scroll-triggered entry effects via CSS class toggling only.
 * No JS Web Animations API is used — animations are pure CSS @keyframes,
 * which guarantees compositor-thread execution and zero Lighthouse impact.
 *
 * The hook sets `data-revealed` on the root container, and child elements
 * use `.reveal-*` CSS classes that respond to the `[data-revealed]` selector.
 */
export function useScrollReveal(
  threshold = 0.12,
  rootMargin = '0px 0px -48px 0px',
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip if user prefers reduced motion — handled by CSS too, but avoids
    // any observer overhead for accessibility-first users.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
            // Unobserve after reveal — fire-once pattern for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * useScrollRevealChildren — Observe multiple child elements individually,
 * enabling precise stagger animations per item without a parent wrapper.
 */
export function useScrollRevealChildren(
  selector: string,
  threshold = 0.1,
  rootMargin = '0px 0px -32px 0px',
) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      container.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.dataset.revealed = 'true';
      });
      return;
    }

    const children = Array.from(
      container.querySelectorAll<HTMLElement>(selector),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [selector, threshold, rootMargin]);

  return containerRef;
}
