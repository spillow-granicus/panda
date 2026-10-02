import type { OpportunitySummary } from "./opportunities";

export const SAMPLE_OPPORTUNITIES: readonly OpportunitySummary[] = [
  {
    id: "sample-rivermark-permits",
    name: "Permit review",
    accountName: "City of Rivermark",
    stageName: "Proposal",
    closeDate: "2026-11-15",
    description:
      "The City of Rivermark reviews building permits across the planning counter, the inspections desk, and a shared spreadsheet. Applicants wait while staff retype the same details into each system before a permit can be issued.",
  },
  {
    id: "sample-rivermark-records",
    name: "Public records requests",
    accountName: "City of Rivermark",
    stageName: "Discovery",
    closeDate: "2026-12-01",
    description:
      "The city clerk wants one view of open public-records requests before adding another counter in the clerk's office.",
  },
];

export function searchSampleOpportunities(customerName: string): OpportunitySummary[] {
  const query = customerName.trim().toLowerCase();
  if (!query) {
    return [];
  }
  return SAMPLE_OPPORTUNITIES.filter((opportunity) => {
    const haystack = `${opportunity.accountName} ${opportunity.name}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function getSampleOpportunity(id: string): OpportunitySummary | null {
  return SAMPLE_OPPORTUNITIES.find((opportunity) => opportunity.id === id) ?? null;
}
