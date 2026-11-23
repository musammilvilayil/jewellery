import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './utils.js';

/** True once the element has scrolled into view. Fires once, so animations don't replay. */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold, rootMargin]);

  return [ref, seen];
}

/**
 * Scroll reveal. variants: up (default), clip (image mask), left, right, fade.
 * `delay` is in ms; use it (or <Stagger>) to cascade siblings.
 */
export function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, style, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${seen ? ' is-in' : ''} ${className}`.trim()}
      style={{ ...style, '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Word-by-word masked heading reveal. */
export function SplitHeading({ as: Tag = 'h2', text, className = '', id, children }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  const words = text.split(' ');
  return (
    <Tag ref={ref} id={id} className={`split ${seen ? 'is-in' : ''} ${className}`.trim()} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="split-word">
            <span style={{ '--i': i }}>{w}</span>
          </span>{' '}
        </span>
      ))}
      {children}
    </Tag>
  );
}

/** Subtle parallax: moves the child vertically a few percent while it crosses the viewport. */
export function useParallax(strength = 0.08) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..1 around the centre
      el.style.transform = `translate3d(0, ${(-progress * strength * 100).toFixed(2)}%, 0) scale(1.14)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [strength]);
  return ref;
}

/** Number that eases up to its value when it first scrolls into view. */
export function CountUp({ value, duration = 1200, format = (n) => String(Math.round(n)) }) {
  const [ref, seen] = useInView({ threshold: 0.6 });
  const [shown, setShown] = useState(prefersReducedMotion() ? value : 0);

  useEffect(() => {
    if (!seen) return undefined;
    if (prefersReducedMotion()) {
      setShown(value);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setShown(value * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return <span ref={ref}>{format(shown)}</span>;
}
