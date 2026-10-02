export const SECTION_IDS = [
  "solutionDesignStage",
  "solutionPresentationLink",
  "coreSolutionHypothesis",
  "targetedSolution",
  "serviceConsiderations",
  "targetedGxcCatalogServices",
  "targetedGxgServices",
  "rationaleKnownBlockers",
  "triggerEvent",
  "agencyPriorities",
  "communityStatement",
  "problemToSolve",
  "attemptsToSolve",
  "successCriteria",
  "solutionDiscovery",
  "recommendedCoreSolutions",
  "recommendedAddOns",
  "recommendedIntegrations",
  "recommendedServiceCatalogServices",
  "recommendedGxgServices",
  "exclusions",
  "exclusionRationale",
  "configurationNotes",
  "quoteGuidance",
  "integrations",
  "customIntegrationNotes",
  "securityReview",
  "scopingRequired",
  "scopingNotes",
  "sowRequired",
  "sowNotes",
  "goLiveConsiderations",
  "recommendedExpansion",
  "expansionReadinessNotes",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionStatus = "salesforce" | "draft" | "accepted";

export type SectionDefinition = {
  id: SectionId;
  group: string;
  label: string;
  question: string;
  consultantAsks: boolean;
};

export const SECTIONS: readonly SectionDefinition[] = [
  {
    id: "solutionDesignStage",
    group: "Details",
    label: "Solution design stage",
    question: "What stage is this solution design in?",
    consultantAsks: true,
  },
  {
    id: "solutionPresentationLink",
    group: "Details",
    label: "Solution presentation",
    question: "Where is the link to the customer-facing presentation?",
    consultantAsks: true,
  },
  {
    id: "coreSolutionHypothesis",
    group: "Solution hypothesis",
    label: "Core solution hypothesis",
    question: "What is the core solution hypothesis? Use the name of a GXC edition, unless this deal is an exception.",
    consultantAsks: true,
  },
  {
    id: "targetedSolution",
    group: "Solution hypothesis",
    label: "Targeted solution",
    question: "Targeted solution is synced from the opportunity and is not edited on the solution design.",
    consultantAsks: false,
  },
  {
    id: "serviceConsiderations",
    group: "Solution hypothesis",
    label: "Service considerations",
    question: "Are Service Catalog services, GXG services, or both pertinent for this deal? Explain why or why not.",
    consultantAsks: true,
  },
  {
    id: "targetedGxcCatalogServices",
    group: "Solution hypothesis",
    label: "Targeted GXC catalog services",
    question: "Which GXC catalog services are targeted?",
    consultantAsks: true,
  },
  {
    id: "targetedGxgServices",
    group: "Solution hypothesis",
    label: "Targeted GXG services",
    question: "Which GXG services are targeted?",
    consultantAsks: true,
  },
  {
    id: "rationaleKnownBlockers",
    group: "Solution hypothesis",
    label: "Rationale and known blockers",
    question: "What is the rationale for this hypothesis, and which blockers are already known?",
    consultantAsks: true,
  },
  {
    id: "triggerEvent",
    group: "Deal strategy and marketable insights",
    label: "Trigger event",
    question: "What trigger event opened this opportunity?",
    consultantAsks: true,
  },
  {
    id: "agencyPriorities",
    group: "Deal strategy and marketable insights",
    label: "Agency priorities",
    question: "What are the agency's priorities?",
    consultantAsks: true,
  },
  {
    id: "communityStatement",
    group: "Deal strategy and marketable insights",
    label: "Community statement",
    question: "What is the community statement for this opportunity?",
    consultantAsks: true,
  },
  {
    id: "problemToSolve",
    group: "Deal strategy and marketable insights",
    label: "Problem to solve",
    question: "What problem is the agency trying to solve, and how is it quantified?",
    consultantAsks: true,
  },
  {
    id: "attemptsToSolve",
    group: "Deal strategy and marketable insights",
    label: "Attempts to solve",
    question: "What has the agency already tried?",
    consultantAsks: true,
  },
  {
    id: "successCriteria",
    group: "Deal strategy and marketable insights",
    label: "Success criteria and metrics",
    question: "What success criteria and metrics will the agency use?",
    consultantAsks: true,
  },
  {
    id: "solutionDiscovery",
    group: "Solution discovery",
    label: "Discovery findings",
    question: "What did discovery establish? This section follows the solution discovery document.",
    consultantAsks: true,
  },
  {
    id: "recommendedCoreSolutions",
    group: "Solution map",
    label: "Recommended core solutions",
    question: "Which core solutions do you recommend?",
    consultantAsks: true,
  },
  {
    id: "recommendedAddOns",
    group: "Solution map",
    label: "Recommended add-ons",
    question: "Which add-ons should be included? These are modules or capabilities that cannot be sold or implemented on their own.",
    consultantAsks: true,
  },
  {
    id: "recommendedIntegrations",
    group: "Solution map",
    label: "Recommended integrations",
    question: "Which third-party systems require integration?",
    consultantAsks: true,
  },
  {
    id: "recommendedServiceCatalogServices",
    group: "Solution map",
    label: "Recommended Service Catalog services",
    question: "Which Service Catalog services would benefit the agency, especially in year 1?",
    consultantAsks: true,
  },
  {
    id: "recommendedGxgServices",
    group: "Solution map",
    label: "Recommended GXG services",
    question: "Which non-credit GXG services do you recommend?",
    consultantAsks: true,
  },
  {
    id: "exclusions",
    group: "Solution map",
    label: "Exclusions",
    question: "Which solution options are not included in this opportunity?",
    consultantAsks: true,
  },
  {
    id: "exclusionRationale",
    group: "Solution map",
    label: "Exclusion rationale",
    question: "Why is each excluded option left out? Note budget, timing, or relevancy.",
    consultantAsks: true,
  },
  {
    id: "configurationNotes",
    group: "Solution map",
    label: "Configuration notes",
    question: "What configuration notes belong in the quote starter or scoping notes? Capabilities plus configurations produce the outcome.",
    consultantAsks: true,
  },
  {
    id: "quoteGuidance",
    group: "Quote strategy",
    label: "Quote guidance",
    question: "What should be used to quote this solution? Include contacts, request volume, and known SKUs.",
    consultantAsks: true,
  },
  {
    id: "integrations",
    group: "Solution validation",
    label: "Integrations",
    question: "Which integrations are in scope? If none, write N/A or None.",
    consultantAsks: true,
  },
  {
    id: "customIntegrationNotes",
    group: "Solution validation",
    label: "Custom integration notes",
    question: "For each custom integration, what is its purpose, and which systems are the source and the target?",
    consultantAsks: true,
  },
  {
    id: "securityReview",
    group: "Solution validation",
    label: "Security and compliance",
    question: "Is a security review required, which certifications were requested, and where is the Loopio project if one exists?",
    consultantAsks: true,
  },
  {
    id: "scopingRequired",
    group: "Solution validation",
    label: "Scoping required",
    question: "Is scoping required for this solution?",
    consultantAsks: true,
  },
  {
    id: "scopingNotes",
    group: "Solution validation",
    label: "Scoping notes",
    question: "What information will be needed to answer the scoping questions?",
    consultantAsks: true,
  },
  {
    id: "sowRequired",
    group: "Solution validation",
    label: "SOW required",
    question: "Is a statement of work required?",
    consultantAsks: true,
  },
  {
    id: "sowNotes",
    group: "Solution validation",
    label: "SOW notes",
    question: "If implementation must approve redlines, what is the high-level summary?",
    consultantAsks: true,
  },
  {
    id: "goLiveConsiderations",
    group: "Solution implementation",
    label: "Go-live considerations",
    question: "What should the agency know about go-live?",
    consultantAsks: true,
  },
  {
    id: "recommendedExpansion",
    group: "Solution expansion",
    label: "Recommended expansion",
    question: "Which expansion fits this agency: Expand across the portfolio, Cross-Sell a complementary product, or Upsell a higher edition?",
    consultantAsks: true,
  },
  {
    id: "expansionReadinessNotes",
    group: "Solution expansion",
    label: "Expansion readiness notes",
    question: "What future opportunities have you discussed with the agency?",
    consultantAsks: true,
  },
];

export function isSectionId(value: string): value is SectionId {
  return SECTIONS.some((section) => section.id === value);
}

export function sectionDefinition(id: SectionId): SectionDefinition {
  const definition = SECTIONS.find((section) => section.id === id);
  if (!definition) {
    throw new Error(`Unknown section ${id}`);
  }
  return definition;
}

export function isIncluded(status: SectionStatus): boolean {
  switch (status) {
    case "salesforce":
    case "accepted":
      return true;
    case "draft":
      return false;
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export function statusLabel(status: SectionStatus): string {
  switch (status) {
    case "salesforce":
      return "From Salesforce";
    case "draft":
      return "Draft";
    case "accepted":
      return "Accepted";
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}
