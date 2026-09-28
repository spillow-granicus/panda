"use client";

export default function DesignError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-4xl">The design could not be loaded.</h1>
      <p className="mt-4 leading-relaxed">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 h-11 rounded-md bg-[var(--pine)] px-4 text-white"
      >
        Try again
      </button>
    </main>
  );
}
