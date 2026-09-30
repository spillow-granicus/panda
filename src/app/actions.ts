"use server";

import { revalidatePath } from "next/cache";
import type { WorkingDesign } from "@/lib/design";
import { isSectionId } from "@/lib/sections";
import { getDesign, saveDesign } from "@/lib/storage";

export type UpdateSectionResult = { ok: true } | { ok: false; error: string };

export async function updateSection(
  opportunityId: string,
  sectionId: string,
  content: string,
  accept: boolean,
): Promise<UpdateSectionResult> {
  if (!isSectionId(sectionId)) {
    return { ok: false, error: "Unknown section." };
  }
  const trimmed = content.trim();
  if (!trimmed) {
    return { ok: false, error: "Write an answer before saving." };
  }

  const design = await getDesign(opportunityId);
  if (!design) {
    return { ok: false, error: "This design is not in the app yet." };
  }

  const nextSections = design.sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }
    const status = accept ? "accepted" : section.status;
    return { ...section, content: trimmed, status };
  });

  const next: WorkingDesign = {
    ...design,
    sections: nextSections,
    updatedAt: new Date().toISOString(),
  };
  await saveDesign(next);
  revalidatePath(`/design/${opportunityId}`);
  revalidatePath(`/design/${opportunityId}/customer`);
  return { ok: true };
}
