import { generateText } from "ai";
import type { SectionDefinition } from "./sections";

export type DraftInput = {
  section: SectionDefinition;
  accountName: string;
  opportunityName: string;
  salesforceContext: string;
  transcriptText: string;
  gongAvailable: boolean;
};

export type DraftResult = {
  text: string;
  sourceNote: string;
};

function clip(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function sourceNoteForDraft(gongAvailable: boolean, usedModel: boolean): string {
  const origin = gongAvailable
    ? "Gong calls on this deal and Salesforce opportunity data"
    : "Salesforce opportunity data. A Gong answer for this section was not available";
  if (usedModel) {
    return `Drafted from ${origin}.`;
  }
  return `Drafted from ${origin}. Edit this before it becomes part of the design.`;
}

export function composeDraft(input: DraftInput): string {
  const lines = [`${input.section.label} for ${input.accountName}.`];
  if (input.transcriptText.trim()) {
    lines.push("", "From Gong:", clip(input.transcriptText, 1200));
  }
  if (input.salesforceContext.trim()) {
    lines.push("", "From Salesforce:", clip(input.salesforceContext, 800));
  }
  if (!input.transcriptText.trim() && !input.salesforceContext.trim()) {
    lines.push("", "No source text was available for this section yet.");
  }
  return lines.join("\n");
}

function draftPrompt(input: DraftInput): string {
  return [
    "You are drafting one section of a customer-facing solution design.",
    `Section: ${input.section.label}`,
    `Question: ${input.section.question}`,
    `Customer: ${input.accountName}`,
    `Opportunity: ${input.opportunityName}`,
    "Salesforce context:",
    input.salesforceContext.trim() || "(none)",
    "Gong ask_deal answer:",
    input.transcriptText.trim() || "(none)",
    "Write the section answer in plain prose the customer can read.",
    "Use only the sources above. Leave out any detail the sources do not support.",
  ].join("\n");
}

async function draftWithModel(input: DraftInput): Promise<string | null> {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return null;
  }
  try {
    const result = await generateText({
      model: "openai/gpt-5.4",
      prompt: draftPrompt(input),
    });
    const text = result.text.trim();
    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

export async function draftSection(
  input: DraftInput,
  generate: (input: DraftInput) => Promise<string | null> = draftWithModel,
): Promise<DraftResult> {
  const generated = await generate(input);
  if (generated) {
    return {
      text: generated,
      sourceNote: sourceNoteForDraft(input.gongAvailable, true),
    };
  }
  return {
    text: composeDraft(input),
    sourceNote: sourceNoteForDraft(input.gongAvailable, false),
  };
}
