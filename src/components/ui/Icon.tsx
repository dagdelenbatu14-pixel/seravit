/** İnce çizgi ikon seti (24×24, stroke 1.5) */
const paths = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  phone: <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4Z" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  store: (
    <>
      <path d="M4 10v10h16V10M3 10l1.5-5h15L21 10H3Z" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  ruler: (
    <>
      <path d="m3.5 16.5 13-13 4 4-13 13-4-4Z" />
      <path d="m7 13 1.8 1.8M9.5 10.5l1.2 1.2M12 8l1.8 1.8M14.5 5.5l1.2 1.2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  percent: (
    <>
      <path d="M18 6 6 18" />
      <circle cx="7.5" cy="7.5" r="2.2" />
      <circle cx="16.5" cy="16.5" r="2.2" />
    </>
  ),
  layers: <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8 12 3.5ZM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  sparkle: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  /* Özellik ikonları */
  rektifiye: (
    <>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 8h2M8 4v2M16 4v2M20 8h-2M4 16h2M8 20v-2M16 20v-2M20 16h-2" />
    </>
  ),
  porselen: <path d="M12 3 20 9l-8 12L4 9l8-6ZM4 9h16M9 9l3 12 3-12" />,
  yer: <path d="M3 17h18M5 17l3-5h8l3 5M9 12l-1 5M15 12l1 5M12 12v5" />,
  duvar: <path d="M4 4h16v16H4zM4 9.5h16M4 15h16M9 4v5.5M15 4v5.5M12 9.5V15M7 15v5M17 15v5" />,
  "ic-mekan": <path d="M4 11 12 4l8 7v9H4v-9ZM10 20v-5h4v5" />,
  "dis-mekan": (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  don: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6.5l2.5-2M9.5 19.5 12 17.5l2.5 2" />,
  kaymaz: <path d="M4 16c3 0 3-2 6-2s3 2 6 2 3-2 4-2M4 20c3 0 3-2 6-2s3 2 6 2 3-2 4-2M12 3c2.5 3 4 5 4 7a4 4 0 0 1-8 0c0-2 1.5-4 4-7Z" />,
  rimless: (
    <>
      <ellipse cx="12" cy="11" rx="7" ry="5" />
      <path d="M8 16.5 9 21h6l1-4.5" />
    </>
  ),
  "soft-close": <path d="M5 18h14M7 18c0-6 2-11 9-12M13 4l3 2-2 3" />,
  termostatik: (
    <>
      <path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0Z" />
      <path d="M12 9v7" />
    </>
  ),
  pvd: <path d="M12 3 14 10l7 2-7 2-2 7-2-7-7-2 7-2 2-7Z" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", title }: { name: IconName; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
