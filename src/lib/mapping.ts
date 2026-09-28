import type { SalesforceSectionMap } from "./salesforce-section-map";
import { SECTIONS, type SectionId } from "./sections";

export function emptySectionValues(): Record<SectionId, string> {
  return {
    futureOutcome: "",
    currentState: "",
    futureState: "",
    successMeasure: "",
    workflow: "",
  };
}

export function resolveSectionValues(
  map: SalesforceSectionMap,
  record: Record<string, unknown> | null,
): Record<SectionId, string> {
  const values = emptySectionValues();
  if (!record || !map.objectApiName) {
    return values;
  }

  for (const section of SECTIONS) {
    const field = map.fields[section.id];
    if (!field) {
      continue;
    }
    const raw = record[field];
    if (typeof raw === "string" && raw.trim()) {
      values[section.id] = raw.trim();
    }
  }

  return values;
}
