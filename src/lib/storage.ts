import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WorkingDesign } from "./design";
import { isSectionId, SECTIONS, type SectionStatus } from "./sections";

type StoreFile = {
  designs: Record<string, WorkingDesign>;
};

let writeChain: Promise<unknown> = Promise.resolve();

export function storePath(): string {
  return process.env.DESIGN_STORE_PATH ?? path.join(process.cwd(), "data", "designs.json");
}

function isStatus(value: unknown): value is SectionStatus {
  return value === "salesforce" || value === "draft" || value === "accepted";
}

function isWorkingDesign(value: unknown): value is WorkingDesign {
  if (!value || typeof value !== "object") {
    return false;
  }
  const design = value as Partial<WorkingDesign>;
  if (typeof design.opportunityId !== "string" || !Array.isArray(design.sections)) {
    return false;
  }
  return design.sections.every(
    (section) =>
      section &&
      typeof section === "object" &&
      typeof section.id === "string" &&
      isSectionId(section.id) &&
      typeof section.content === "string" &&
      isStatus(section.status),
  );
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(/* turbopackIgnore: true */ storePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreFile>;
    const designs: Record<string, WorkingDesign> = {};
    for (const [id, design] of Object.entries(parsed.designs ?? {})) {
      if (isWorkingDesign(design)) {
        designs[id] = design;
      }
    }
    return { designs };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return { designs: {} };
    }
    throw error;
  }
}

async function writeStore(store: StoreFile): Promise<void> {
  const filePath = storePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(/* turbopackIgnore: true */ filePath, JSON.stringify(store, null, 2));
}

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function getDesign(opportunityId: string): Promise<WorkingDesign | null> {
  const store = await readStore();
  return store.designs[opportunityId] ?? null;
}

export async function saveDesign(design: WorkingDesign): Promise<void> {
  await withLock(async () => {
    const store = await readStore();
    const ordered = SECTIONS.map((section) => design.sections.find((item) => item.id === section.id)).filter(
      (section): section is WorkingDesign["sections"][number] => Boolean(section),
    );
    store.designs[design.opportunityId] = { ...design, sections: ordered };
    await writeStore(store);
  });
}
