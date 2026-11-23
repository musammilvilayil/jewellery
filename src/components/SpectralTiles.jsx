import { useRef } from 'react';

/**
 * SpectralTiles: frosted glass tiles lit from below by slowly drifting light.
 * A wrapper for hero sections, pages or cards. Plain React + CSS (see ".st" in global.css), no UI registry needed.
 *
 * Usage:
 *   <SpectralTiles as="section" className="hero" colors={['#f1d36d', '#c25a6a', '#e08a4a']}>
 *     <h1>Content stays sharp above the effect</h1>
 *   </SpectralTiles>
 *
 * Props: `colors` (three light colours), `tile` (tile size in px), `background` (base colour).
 */
export default function SpectralTiles({
  as: Tag = 'div',
  className = '',
  colors = ['#22d3ee', '#a855f7', '#f59e0b'],
  tile = 56,
  background = '#07080c',
  children,
  ...rest
}) {
  const ref = useRef(null);

  // Cursor position drives a soft highlight across the tiles
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref}
      className={`st ${className}`.trim()}
      onPointerMove={onMove}
      style={{ '--st-bg': background, '--st-a': colors[0], '--st-b': colors[1], '--st-c': colors[2], '--st-tile': `${tile}px` }}
      {...rest}
    >
      <div className="st-lights" aria-hidden="true">
        <span className="st-orb st-orb-1" />
        <span className="st-orb st-orb-2" />
        <span className="st-orb st-orb-3" />
        <span className="st-orb st-orb-4" />
      </div>
      <div className="st-tiles" aria-hidden="true" />
      <div className="st-glow" aria-hidden="true" />
      <div className="st-content">{children}</div>
    </Tag>
  );
}
