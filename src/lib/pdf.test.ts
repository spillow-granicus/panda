import { describe, expect, it } from "vitest";
import type { WorkingDesign } from "./design";
import { renderDesignPdf } from "./pdf";

const design: WorkingDesign = {
  opportunityId: "sample-rivermark-permits",
  opportunityName: "Permit review",
  accountName: "City of Rivermark",
  stageName: "Proposal",
  updatedAt: "2026-09-28T00:00:00.000Z",
  sections: [
    {
      id: "futureOutcome",
      content: "Permits are issued in one pass.\nApplicants no longer wait on three desks.",
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
