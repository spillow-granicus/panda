import type { WorkingDesign } from "./design";
import { isIncluded, sectionDefinition } from "./sections";

export function slideReadyText(design: WorkingDesign): string {
  const included = design.sections.filter((section) => isIncluded(section.status));
  if (included.length === 0) {
    return [
      design.accountName,
      design.opportunityName,
      "",
      "No sections are ready to share yet.",
    ].join("\n");
  }

  return included
    .map((section) => {
      const definition = sectionDefinition(section.id);
      return [
        definition.label,
        `Title: ${definition.label}`,
        "Body:",
        section.content,
        "Speaker notes:",
        section.sourceNote,
      ].join("\n");
    })
    .join("\n\n---\n\n");
}

export function downloadFileName(accountName: string, suffix: string): string {
  const slug = accountName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${slug || "solution-design"}-${suffix}`;
}
