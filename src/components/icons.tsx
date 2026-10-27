// Small stroke icons used across the site. 24px grid, inherit currentColor.
type P = { className?: string };

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const HomeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
  </svg>
);

export const FolderIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3.5 7.5a2 2 0 0 1 2-2h3.6l2 2.2h7.4a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
  </svg>
);

export const FileIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
    <path d="M14 3.5V8h4.5M9 12.5h6M9 16h4" />
  </svg>
);

export const LaptopIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="5" y="5" width="14" height="10" rx="1.5" />
    <path d="M3 18.5h18M9.5 18.5l.5-1.5h4l.5 1.5" />
  </svg>
);

export const SparkIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z" />
    <path d="M18.5 15.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3z" />
  </svg>
);

export const MailIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </svg>
);

export const PinIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const ExternalIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 4.5h5.5V10M19.5 4.5 11 13M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10" />
  </svg>
);

export const BackIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ChevronIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const DownloadIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" />
  </svg>
);

export const UptimeIcon = ({ className }: P) => (
  <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden className={className}>
    {[0, 3, 6, 9, 12, 15, 18].map((x) => (
      <rect key={x} x={x} y="1" width="2" height="10" rx="1" fill="currentColor" />
    ))}
  </svg>
);

export const CopyIcon =({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const CloseIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const SendIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

// Brand marks drawn as filled glyphs.
export const GitHubIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

export const LinkedInIcon = ({ className }: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zm6.5 0h3.8v1.6h.06c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.6 4.75 6v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z" />
  </svg>
);

export const ExpandIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);

export const CollapseIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
);
