import { describe, expect, it } from "vitest";
import { composeDraft, draftSection } from "./draft";
import { sectionDefinition } from "./sections";

const input = {
  section: sectionDefinition("problemToSolve"),
  accountName: "City of Rivermark",
  opportunityName: "Permit review",
  salesforceContext: "Description: Building permits wait at the planning counter.",
  transcriptText: "Staff retype each application.",
  gongAvailable: true,
};

describe("draftSection", () => {
  it("composes a draft from transcripts and Salesforce context", () => {
    const text = composeDraft(input);
    expect(text).toContain("City of Rivermark");
    expect(text).toContain("Staff retype each application.");
    expect(text).toContain("Building permits wait at the planning counter.");
  });

  it("uses a generated answer when one is returned", async () => {
    const result = await draftSection(input, async () => "Permits leave the counter once.");
    expect(result.text).toBe("Permits leave the counter once.");
    expect(result.sourceNote).toContain("Gong calls on this deal");
  });

  it("falls back to the composed draft when generation is unavailable", async () => {
    const result = await draftSection({ ...input, gongAvailable: false, transcriptText: "" }, async () => null);
    expect(result.text).toContain("planning counter");
    expect(result.sourceNote).toContain("A Gong answer for this section was not available");
  });
});
