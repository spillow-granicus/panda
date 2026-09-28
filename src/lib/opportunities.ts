export type OpportunitySummary = {
  id: string;
  name: string;
  accountName: string;
  stageName: string;
  closeDate: string | null;
  description: string;
};

export function opportunityContext(opportunity: OpportunitySummary): string {
  const lines = [
    `Account: ${opportunity.accountName}`,
    `Opportunity: ${opportunity.name}`,
    `Stage: ${opportunity.stageName}`,
  ];
  if (opportunity.closeDate) {
    lines.push(`Close date: ${opportunity.closeDate}`);
  }
  if (opportunity.description.trim()) {
    lines.push(`Description: ${opportunity.description.trim()}`);
  }
  return lines.join("\n");
}
