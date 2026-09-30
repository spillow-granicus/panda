import { describe, expect, it } from "vitest";
import type { WorkingDesign } from "./design";
import { renderDesignPdf } from "./pdf";

const design: WorkingDesign = {
  opportunityId: "sample-northwind-platform",
  opportunityName: "Platform rollout",
  accountName: "Northwind Commerce",
  stageName: "Proposal",
  updatedAt: "2026-09-28T00:00:00.000Z",
  sections: [
    {
      id: "futureOutcome",
      content: "Orders ship the same day.\nThe inbox is no longer the queue.",
      status: "accepted",
      sourceNote: "Edited by the consultant.",
    },
    {
      id: "currentState",
      content: "Hidden draft",
      status: "draft",
      sourceNote: "",
    },
    {
      id: "futureState",
      content: "",
      status: "draft",
      sourceNote: "",
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

describe("renderDesignPdf", () => {
  it("returns a pdf for the accepted sections", async () => {
    const bytes = await renderDesignPdf(design);
    const header = Buffer.from(bytes.subarray(0, 5)).toString("utf8");
    expect(header).toBe("%PDF-");
    expect(bytes.byteLength).toBeGreaterThan(500);
  });
});
