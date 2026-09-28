import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-[var(--line)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl tracking-tight">
          Solution design
        </Link>
        <p className="text-sm text-[var(--ink)]/70">Consultant workspace</p>
      </div>
    </header>
  );
}
