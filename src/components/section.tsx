import Link from "next/link";

export function Section({
  id,
  title,
  intro,
  aside,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h2 id={`${id}-title`} className="text-[24px] font-black tracking-[-0.03em]">
            {title}
          </h2>
          {intro && <p className="mt-1 text-[15px] text-muted">{intro}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** The small link on the right of a section heading ("All projects →", "Full history →"). */
export function SectionLink({
  href,
  children,
  icon,
  download,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  download?: boolean;
}) {
  const className =
    "inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent";
  const content = (
    <>
      {icon}
      {children}
      {!icon && <span aria-hidden>{href.startsWith("http") ? "↗" : "→"}</span>}
    </>
  );
  if (download || href.startsWith("http")) {
    return (
      <a href={href} className={className} {...(download ? { download: "" } : { target: "_blank", rel: "noreferrer" })}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
