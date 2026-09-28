"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateSection } from "@/app/actions";
import type { WorkingDesign } from "@/lib/design";
import { isIncluded, sectionDefinition, statusLabel } from "@/lib/sections";

type DesignWorkspaceProps = {
  design: WorkingDesign;
  salesforceConnected: boolean;
  sectionMapConfigured: boolean;
  gongConfigured: boolean;
};

export function DesignWorkspace({
  design,
  salesforceConnected,
  sectionMapConfigured,
  gongConfigured,
}: DesignWorkspaceProps) {
  const firstDraft = design.sections.findIndex((section) => section.status === "draft");
  const [index, setIndex] = useState(firstDraft === -1 ? 0 : firstDraft);
  const section = design.sections[index];
  const definition = section ? sectionDefinition(section.id) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Solution design sections">
        <ol className="space-y-2">
          {design.sections.map((item, itemIndex) => {
            const itemDefinition = sectionDefinition(item.id);
            const current = itemIndex === index;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={current ? "step" : undefined}
                  onClick={() => setIndex(itemIndex)}
                  className={`w-full rounded-md border px-3 py-2 text-left ${
                    current
                      ? "border-[var(--pine)] bg-[var(--card)]"
                      : "border-transparent hover:border-[var(--line)]"
                  }`}
                >
                  <span className="block text-sm">{itemDefinition.label}</span>
                  <span className="text-xs text-[var(--ink)]/60">{statusLabel(item.status)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {section && definition ? (
        <SectionStep
          key={`${section.id}:${section.status}:${section.content}`}
          opportunityId={design.opportunityId}
          sectionId={section.id}
          label={definition.label}
          question={definition.question}
          content={section.content}
          status={section.status}
          sourceNote={section.sourceNote}
          onAdvance={() => setIndex((current) => Math.min(current + 1, design.sections.length - 1))}
        />
      ) : null}

      <aside className="lg:col-span-2 border-t border-[var(--line)] pt-6 text-sm leading-relaxed text-[var(--ink)]/75">
        <p>
          {salesforceConnected
            ? "Salesforce is connected and read-only."
            : "Salesforce is not connected. This design started from a sample opportunity."}
        </p>
        <p className="mt-2">
          {sectionMapConfigured
            ? "Mapped Salesforce fields that already have values are shown as filled."
            : "The Salesforce solution design object is not mapped yet, so each section starts as a draft."}
        </p>
        <p className="mt-2">
          {gongConfigured
            ? "Gong transcripts are requested for this opportunity."
            : "Gong is not connected. Drafts use the Salesforce opportunity data that is already here."}
        </p>
        <p className="mt-4">
          <Link className="underline" href={`/design/${design.opportunityId}/customer`}>
            Customer view
          </Link>
          {" · "}
          <a className="underline" href={`/design/${design.opportunityId}/pdf`}>
            Download PDF
          </a>
          {" · "}
          <a className="underline" href={`/design/${design.opportunityId}/slides`}>
            Slide-ready text
          </a>
        </p>
        <p className="mt-2">
          {design.sections.filter((item) => isIncluded(item.status)).length} of {design.sections.length} sections
          are ready to show the customer.
        </p>
      </aside>
    </div>
  );
}

function SectionStep({
  opportunityId,
  sectionId,
  label,
  question,
  content,
  status,
  sourceNote,
  onAdvance,
}: {
  opportunityId: string;
  sectionId: string;
  label: string;
  question: string;
  content: string;
  status: WorkingDesign["sections"][number]["status"];
  sourceNote: string;
  onAdvance: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(content);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const included = isIncluded(status);

  async function save(accept: boolean) {
    setPending(true);
    setError(null);
    const result = await updateSection(opportunityId, sectionId, value, accept);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
    if (accept || included) {
      onAdvance();
    }
  }

  return (
    <section aria-labelledby={`section-${sectionId}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--pine)]">{statusLabel(status)}</p>
      <h2 id={`section-${sectionId}`} className="mt-2 text-4xl">
        {label}
      </h2>
      <p className="mt-4 text-lg leading-relaxed">{included ? "This section is already part of the design." : question}</p>
      <label className="mt-6 block text-sm" htmlFor={`answer-${sectionId}`}>
        {included ? "Section text" : "Draft answer"}
      </label>
      <textarea
        id={`answer-${sectionId}`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={12}
        className="mt-2 w-full rounded-md border border-[var(--line)] bg-[var(--card)] p-4 leading-relaxed outline-none ring-[var(--pine)] focus:ring-2"
      />
      <p className="mt-3 text-sm text-[var(--ink)]/70">{sourceNote}</p>
      {error ? <p className="mt-3 text-sm">{error}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {included ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => save(false)}
            className="h-11 rounded-md bg-[var(--pine)] px-4 text-white disabled:opacity-60"
          >
            Save and continue
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => save(true)}
              className="h-11 rounded-md bg-[var(--pine)] px-4 text-white disabled:opacity-60"
            >
              Use this answer
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => save(false)}
              className="h-11 rounded-md border border-[var(--line)] bg-[var(--card)] px-4 disabled:opacity-60"
            >
              Save draft
            </button>
          </>
        )}
      </div>
    </section>
  );
}
