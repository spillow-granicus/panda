import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { getOpportunitySource } from "@/lib/opportunity-source";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const source = getOpportunitySource();
  let opportunities: Awaited<ReturnType<typeof source.search>> = [];
  let errorMessage: string | null = null;

  if (query) {
    try {
      opportunities = await source.search(query);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Opportunity search failed.";
    }
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <form action="/opportunities" className="flex max-w-xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="customer-name">
            Customer name
          </label>
          <input
            id="customer-name"
            name="q"
            defaultValue={query}
            required
            placeholder="Customer name"
            className="h-12 flex-1 rounded-md border border-[var(--line)] bg-[var(--card)] px-4 outline-none ring-[var(--pine)] focus:ring-2"
          />
          <button
            type="submit"
            className="h-12 rounded-md bg-[var(--pine)] px-5 text-white hover:bg-[var(--pine-deep)]"
          >
            Find opportunities
          </button>
        </form>

        {!query ? <p className="mt-10 text-lg">Enter a customer name to see matching opportunities.</p> : null}
        {errorMessage ? <p className="mt-10 text-lg">{errorMessage}</p> : null}
        {query && !errorMessage && opportunities.length === 0 ? (
          <p className="mt-10 text-lg">No opportunities match {query}.</p>
        ) : null}

        {opportunities.length > 0 ? (
          <ul className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {opportunities.map((opportunity) => (
              <li key={opportunity.id}>
                <Link
                  href={`/design/${opportunity.id}`}
                  className="flex flex-col gap-1 py-5 hover:bg-[var(--card)] sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span>
                    <span className="block font-display text-2xl">{opportunity.name}</span>
                    <span className="text-sm text-[var(--ink)]/70">{opportunity.accountName}</span>
                  </span>
                  <span className="text-sm text-[var(--ink)]/70">
                    {opportunity.stageName}
                    {opportunity.closeDate ? ` · ${opportunity.closeDate}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </>
  );
}
