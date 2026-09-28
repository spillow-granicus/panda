export const SECTION_IDS = [
  "futureOutcome",
  "currentState",
  "futureState",
  "successMeasure",
  "workflow",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionStatus = "salesforce" | "draft" | "accepted";

export type SectionDefinition = {
  id: SectionId;
  label: string;
  question: string;
};

export const SECTIONS: readonly SectionDefinition[] = [
  {
    id: "futureOutcome",
    label: "Future outcome",
    question: "What future outcome is this solution meant to produce for the customer?",
  },
  {
    id: "currentState",
    label: "Current state",
    question: "What is the customer's current state?",
  },
  {
    id: "futureState",
    label: "Future state",
    question: "What does the future state look like once the solution is in place?",
  },
  {
    id: "successMeasure",
    label: "Success measure",
    question: "How will the customer measure success?",
  },
  {
    id: "workflow",
    label: "Workflow",
    question: "What workflow carries the customer from the current state to the future state?",
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
