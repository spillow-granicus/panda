import { describe, expect, it } from "vitest";
import type { WorkingDesign } from "./design";
import { slideReadyText } from "./slides";

const design: WorkingDesign = {
  opportunityId: "sample-rivermark-permits",
  opportunityName: "Permit review",
  accountName: "City of Rivermark",
  stageName: "Proposal",
  updatedAt: "2026-09-28T00:00:00.000Z",
  sections: [
    {
      id: "futureOutcome",
      content: "Permits are issued in one pass.",
      status: "accepted",
      sourceNote: "Edited by the consultant.",
    },
    {
      id: "currentState",
      content: "Still a draft.",
      status: "draft",
      sourceNote: "Drafted from Salesforce opportunity data.",
    },
    {
      id: "futureState",
      content: "One permit counter.",
      status: "salesforce",
      sourceNote: "Pulled from the Salesforce solution design.",
    },
    {
      id: "successMeasure",
      content: "",
      status: "draft",
      sourceNote: "",
    },
    {
      id: "workflow",
      content: "",
      status: "draft",
      sourceNote: "",
    },
  ],
};

describe("slideReadyText", () => {
  it("exports title, body, and speaker notes for included sections only", () => {
    const text = slideReadyText(design);
    expect(text).toContain("Title: Future outcome");
    expect(text).toContain("Body:\nPermits are issued in one pass.");
    expect(text).toContain("Speaker notes:\nEdited by the consultant.");
    expect(text).toContain("Title: Future state");
    expect(text).not.toContain("Still a draft.");
  });
});
