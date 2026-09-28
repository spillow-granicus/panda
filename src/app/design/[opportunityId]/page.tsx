import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { DesignWorkspace } from "@/components/design-workspace";
import { getOrCreateDesign } from "@/lib/design-session";
import { readGongConfig } from "@/lib/gong";
import { getOpportunitySource } from "@/lib/opportunity-source";
import { isSectionMapConfigured, salesforceSectionMap } from "@/lib/salesforce-section-map";

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
  const source = getOpportunitySource();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--pine)]">{design.accountName}</p>
        <h1 className="mt-2 text-5xl">{design.opportunityName}</h1>
        <p className="mt-3 text-[var(--ink)]/70">{design.stageName}</p>
        <div className="mt-10">
          <DesignWorkspace
            design={design}
            salesforceConnected={source.mode === "salesforce"}
            sectionMapConfigured={isSectionMapConfigured(salesforceSectionMap)}
            gongConfigured={readGongConfig() !== null}
          />
        </div>
      </main>
    </>
  );
}
