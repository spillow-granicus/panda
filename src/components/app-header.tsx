import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-8">
        <Link href="/" className="inline-flex">
          <img src="/brand/granicus-horizontal.png" alt="Granicus" className="h-8 w-auto" />
        </Link>
        <p className="text-sm">Solution design</p>
      </div>
    </header>
  );
}
