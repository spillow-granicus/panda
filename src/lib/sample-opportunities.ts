import type { OpportunitySummary } from "./opportunities";

export const SAMPLE_OPPORTUNITIES: readonly OpportunitySummary[] = [
  {
    id: "sample-northwind-platform",
    name: "Platform rollout",
    accountName: "Northwind Commerce",
    stageName: "Proposal",
    closeDate: "2026-11-15",
    description:
      "Northwind Commerce runs order exceptions in a shared inbox. The operations team retypes the same customer details into three tools before an order can ship.",
  },
  {
    id: "sample-northwind-support",
    name: "Support expansion",
    accountName: "Northwind Commerce",
    stageName: "Discovery",
    closeDate: "2026-12-01",
    description:
      "Support leads want a single view of open cases before they hire another regional team.",
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
