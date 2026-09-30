import type { SectionId } from "./sections";

/**
 * Maps Salesforce solution-design fields onto the five template sections.
 * Object and field API names stay empty until they are supplied.
 * An unmapped section is treated as empty and drafted in this app.
 */
export type SalesforceSectionMap = {
  objectApiName: string | null;
  opportunityLookupField: string | null;
  fields: Record<SectionId, string | null>;
};

export const salesforceSectionMap: SalesforceSectionMap = {
  objectApiName: null,
  opportunityLookupField: null,
  fields: {
    futureOutcome: null,
    currentState: null,
    futureState: null,
    successMeasure: null,
    workflow: null,
  },
};

export function isSectionMapConfigured(map: SalesforceSectionMap): boolean {
  if (!map.objectApiName || !map.opportunityLookupField) {
    return false;
  }
  return Object.values(map.fields).some((field) => Boolean(field));
}
