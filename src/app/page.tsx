import { AppHeader } from "@/components/app-header";
import { isSalesforceConfigured } from "@/lib/salesforce";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const salesforceConnected = isSalesforceConfigured();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--pine)]">Start</p>
        <h1 className="mt-3 max-w-2xl text-5xl leading-tight">Name the customer.</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink)]/80">
          The app lists matching opportunities. Open one to continue its solution design.
        </p>
        <form action="/opportunities" className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="customer-name">
            Customer name
          </label>
          <input
            id="customer-name"
            name="q"
            required
            placeholder="Customer name"
            className="h-12 flex-1 rounded-md border border-[var(--line)] bg-[var(--card)] px-4 text-base outline-none ring-[var(--pine)] focus:ring-2"
          />
          <button
            type="submit"
            className="h-12 rounded-md bg-[var(--pine)] px-5 text-base text-white hover:bg-[var(--pine-deep)]"
          >
            Find opportunities
          </button>
        </form>
        {salesforceConnected ? (
          <p className="mt-6 text-sm text-[var(--ink)]/70">Salesforce is connected. Search reads live opportunities.</p>
        ) : (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--ink)]/70">
            Salesforce is not connected. A search still returns sample opportunities so you can walk a design.
            Try City of Rivermark.
          </p>
        )}
      </main>
    </>
  );
}
