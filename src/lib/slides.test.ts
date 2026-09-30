import { describe, expect, it } from "vitest";
import type { WorkingDesign } from "./design";
import { slideReadyText } from "./slides";

const design: WorkingDesign = {
  opportunityId: "sample-northwind-platform",
  opportunityName: "Platform rollout",
  accountName: "Northwind Commerce",
  stageName: "Proposal",
  updatedAt: "2026-09-28T00:00:00.000Z",
  sections: [
    {
      id: "futureOutcome",
      content: "Orders ship the same day.",
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
      content: "One queue.",
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
    expect(text).toContain("Body:\nOrders ship the same day.");
    expect(text).toContain("Speaker notes:\nEdited by the consultant.");
    expect(text).toContain("Title: Future state");
    expect(text).not.toContain("Still a draft.");
  });
});
