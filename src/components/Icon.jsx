const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" {...s} />
      <path d="m20 20-3.8-3.8" {...s} />
    </>
  ),
  heart: <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" {...s} />,
  heartFilled: (
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
      {...s}
      fill="currentColor"
    />
  ),
  bag: (
    <>
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" {...s} />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" {...s} />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" {...s} />,
  close: <path d="M6 6l12 12M18 6 6 18" {...s} />,
  plus: <path d="M12 5v14M5 12h14" {...s} strokeWidth={2} />,
  minus: <path d="M5 12h14" {...s} strokeWidth={2} />,
  chat: (
    <>
      <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6l-3.9.9Z" {...s} />
      <path d="M9 10.5h6M9 13.5h4" {...s} />
    </>
  ),
  phone: (
    <path
      d="M6.6 3.5h2.6l1.4 4.2-2 1.3a11 11 0 0 0 6.4 6.4l1.3-2 4.2 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
      {...s}
    />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" {...s} />
      <path d="m4 7 8 6 8-6" {...s} />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" {...s} />
      <circle cx="12" cy="12" r="4" {...s} />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" {...s} />
      <circle cx="12" cy="10" r="2.4" {...s} />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" {...s} />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.6" {...s} />
      <path d="M4.8 20c.8-3.6 3.6-5.6 7.2-5.6s6.4 2 7.2 5.6" {...s} />
    </>
  ),
  home: <path d="M4 11.2 12 4l8 7.2V20h-5.5v-5.5h-5V20H4z" {...s} />,
  grid: <path d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" {...s} />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" {...s} />
      <circle cx="12" cy="12" r="2.8" {...s} />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" {...s} strokeWidth={2.2} />,
  chevron: <path d="m6 9 6 6 6-6" {...s} />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" {...s} />,
  truck: (
    <>
      <path d="M3 6.5h11v9H3zM14 10h4l3 3v2.5h-7" {...s} />
      <circle cx="7.5" cy="17" r="1.8" {...s} />
      <circle cx="17" cy="17" r="1.8" {...s} />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.3 2.9 7.7 7 9 4.1-1.3 7-4.7 7-9V6l-7-2.5Z" {...s} />
      <path d="m9 12 2.2 2.2L15.2 10" {...s} />
    </>
  ),
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" {...s} />,
  spark: <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" {...s} strokeWidth={1.6} />,
};

/** Decorative inline icon. Give the parent button an aria-label when the icon is its only content. */
export default function Icon({ name, className = 'icon' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
