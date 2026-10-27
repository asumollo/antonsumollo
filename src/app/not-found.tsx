import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[720px] flex-col justify-center gap-4 px-5 sm:px-6">
      <h1 className="text-[32px] font-extrabold tracking-[-0.02em]">This page doesn&apos;t exist</h1>
      <p className="text-muted">The link may be old or mistyped.</p>
      <Link href="/" className="w-fit font-semibold text-accent underline underline-offset-4">
        Go to the home page
      </Link>
    </main>
  );
}
