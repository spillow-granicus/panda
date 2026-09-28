import { describe, expect, it } from "vitest";
import { composeDraft, draftSection } from "./draft";
import { sectionDefinition } from "./sections";

const input = {
  section: sectionDefinition("currentState"),
  accountName: "Northwind Commerce",
  opportunityName: "Platform rollout",
  salesforceContext: "Description: Orders sit in a shared inbox.",
  transcriptText: "The team retypes each exception.",
  gongAvailable: true,
};

describe("draftSection", () => {
  it("composes a draft from transcripts and Salesforce context", () => {
    const text = composeDraft(input);
    expect(text).toContain("Northwind Commerce");
    expect(text).toContain("The team retypes each exception.");
    expect(text).toContain("Orders sit in a shared inbox.");
  });

  it("uses a generated answer when one is returned", async () => {
    const result = await draftSection(input, async () => "Exceptions leave the inbox once.");
    expect(result.text).toBe("Exceptions leave the inbox once.");
    expect(result.sourceNote).toContain("Gong transcripts");
  });

  it("falls back to the composed draft when generation is unavailable", async () => {
    const result = await draftSection({ ...input, gongAvailable: false, transcriptText: "" }, async () => null);
    expect(result.text).toContain("shared inbox");
    expect(result.sourceNote).toContain("Gong transcripts were not available");
  });
});
