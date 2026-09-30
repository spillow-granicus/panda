import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { WorkingDesign } from "./design";
import { getDesign, saveDesign } from "./storage";

const design: WorkingDesign = {
  opportunityId: "sample-northwind-platform",
  opportunityName: "Platform rollout",
  accountName: "Northwind Commerce",
  stageName: "Proposal",
  updatedAt: "2026-09-28T00:00:00.000Z",
  sections: [
    {
      id: "futureOutcome",
      content: "Ship the same day.",
      status: "draft",
      sourceNote: "Draft.",
    },
  ],
};

let directory: string;

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), "panda-designs-"));
  process.env.DESIGN_STORE_PATH = path.join(directory, "designs.json");
});

afterEach(async () => {
  delete process.env.DESIGN_STORE_PATH;
  await rm(directory, { recursive: true, force: true });
});

describe("storage", () => {
  it("saves and reloads a design by opportunity id", async () => {
    expect(await getDesign(design.opportunityId)).toBeNull();
    await saveDesign(design);
    const loaded = await getDesign(design.opportunityId);
    expect(loaded?.opportunityName).toBe("Platform rollout");
    expect(loaded?.sections[0]?.content).toBe("Ship the same day.");
  });
});
