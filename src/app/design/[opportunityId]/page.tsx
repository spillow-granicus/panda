import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { DesignWorkspace } from "@/components/design-workspace";
import { getOrCreateDesign } from "@/lib/design-session";

export const dynamic = "force-dynamic";

export default async function DesignPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;
  const design = await getOrCreateDesign(opportunityId);
  if (!design) {
    notFound();
  }
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm font-bold text-[var(--granicus-dark-red)]">{design.accountName}</p>
        <h1 className="mt-2 text-5xl">{design.opportunityName}</h1>
        <p className="mt-3 text-[var(--ink)]/70">{design.stageName}</p>
        <div className="mt-10">
          <DesignWorkspace design={design} />
        </div>
      </main>
    </>
  );
}
