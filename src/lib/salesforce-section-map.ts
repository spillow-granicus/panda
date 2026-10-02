import { SECTIONS, type SectionId } from "./sections";

/**
 * Maps Salesforce solution-design field API names onto the record sections.
 * Object and field API names stay empty until they are supplied.
 * An unmapped field is treated as empty and drafted in this app.
 */
export type SalesforceSectionMap = {
  objectApiName: string | null;
  opportunityLookupField: string | null;
  fields: Record<SectionId, string | null>;
};

function unmappedFields(): Record<SectionId, string | null> {
  return Object.fromEntries(SECTIONS.map((section) => [section.id, null])) as Record<SectionId, string | null>;
}

export const salesforceSectionMap: SalesforceSectionMap = {
  objectApiName: null,
  opportunityLookupField: null,
  fields: unmappedFields(),
};

export function isSectionMapConfigured(map: SalesforceSectionMap): boolean {
  if (!map.objectApiName || !map.opportunityLookupField) {
    return false;
  }
  return Object.values(map.fields).some((field) => Boolean(field));
}
