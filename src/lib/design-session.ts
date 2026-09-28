import { draftSection } from "./draft";
import type { WorkingDesign } from "./design";
import { resolveSectionValues } from "./mapping";
import type { OpportunitySummary } from "./opportunities";
import { opportunityContext } from "./opportunities";
import { getOpportunitySource } from "./opportunity-source";
import { fetchGongTranscripts, type GongTranscripts } from "./gong";
import { salesforceSectionMap } from "./salesforce-section-map";
import { SECTIONS } from "./sections";
import { getDesign, saveDesign } from "./storage";

function knownSectionContext(resolved: Record<string, string>): string {
  return SECTIONS.flatMap((section) => {
    const value = resolved[section.id];
    return value ? [`${section.label}: ${value}`] : [];
  }).join("\n");
}

async function buildDesign(
  opportunity: OpportunitySummary,
  fieldRecord: Record<string, unknown> | null,
  gong: GongTranscripts,
): Promise<WorkingDesign> {
  const resolved = resolveSectionValues(salesforceSectionMap, fieldRecord);
  const transcriptText = gong.status === "ready" ? gong.text : "";
  const gongAvailable = gong.status === "ready" && transcriptText.length > 0;
  const salesforceContext = [opportunityContext(opportunity), knownSectionContext(resolved)]
    .filter((part) => part.trim())
    .join("\n");

  const sections = await Promise.all(
    SECTIONS.map(async (section) => {
      const existing = resolved[section.id];
      if (existing) {
        return {
          id: section.id,
          content: existing,
          status: "salesforce" as const,
          sourceNote: "Pulled from the Salesforce solution design.",
        };
      }
      const draft = await draftSection({
        section,
        accountName: opportunity.accountName,
        opportunityName: opportunity.name,
        salesforceContext,
        transcriptText,
        gongAvailable,
      });
      return {
        id: section.id,
        content: draft.text,
        status: "draft" as const,
        sourceNote: draft.sourceNote,
      };
    }),
  );

  return {
    opportunityId: opportunity.id,
    opportunityName: opportunity.name,
    accountName: opportunity.accountName,
    stageName: opportunity.stageName,
    sections,
    updatedAt: new Date().toISOString(),
  };
}

export async function getOrCreateDesign(opportunityId: string): Promise<WorkingDesign | null> {
  const existing = await getDesign(opportunityId);
  if (existing) {
    return existing;
  }

  const source = getOpportunitySource();
  const [opportunity, fieldRecord, gong] = await Promise.all([
    source.getOpportunity(opportunityId),
    source.readMappedFields(opportunityId),
    fetchGongTranscripts(opportunityId),
  ]);
  if (!opportunity) {
    return null;
  }

  const design = await buildDesign(opportunity, fieldRecord, gong);
  await saveDesign(design);
  return design;
}
