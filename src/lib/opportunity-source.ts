import type { OpportunitySummary } from "./opportunities";
import { getSampleOpportunity, searchSampleOpportunities } from "./sample-opportunities";
import {
  getSalesforceOpportunity,
  isSalesforceConfigured,
  readSalesforceSolutionFields,
  searchSalesforceOpportunities,
} from "./salesforce";

export type OpportunitySourceMode = "salesforce" | "sample";

export type OpportunitySource = {
  mode: OpportunitySourceMode;
  search(customerName: string): Promise<OpportunitySummary[]>;
  getOpportunity(id: string): Promise<OpportunitySummary | null>;
  readMappedFields(opportunityId: string): Promise<Record<string, unknown> | null>;
};

export function getOpportunitySource(): OpportunitySource {
  if (isSalesforceConfigured()) {
    return {
      mode: "salesforce",
      search: searchSalesforceOpportunities,
      getOpportunity: getSalesforceOpportunity,
      readMappedFields: readSalesforceSolutionFields,
    };
  }

  return {
    mode: "sample",
    search: async (customerName) => searchSampleOpportunities(customerName),
    getOpportunity: async (id) => getSampleOpportunity(id),
    readMappedFields: async () => null,
  };
}
