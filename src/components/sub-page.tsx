import Link from "next/link";
import { getProjectIndex } from "@/lib/projects";
import { BackIcon } from "./icons";
import { Footer } from "./contact";
import { Dock } from "./dock";

/** Layout for secondary pages: back link, title, intro, then content. */
export function SubPage({
  title,
  intro,
  back = { href: "/", label: "Home" },
  children,
}: {
  title: string;
  intro?: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="graph-paper" aria-hidden />
      <main className="relative mx-auto flex max-w-[720px] flex-col px-5 pb-16 pt-10 sm:px-6 sm:pt-14">
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-muted hover:text-ink"
        >
          <BackIcon className="h-4 w-4" />
          {back.label}
        </Link>
        <h1 className="mt-8 text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">{title}</h1>
        {intro && <p className="mt-3 max-w-[52ch] text-[18px] text-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </main>
      <Footer />
      <Dock projects={getProjectIndex()} />
    </>
  );
}
