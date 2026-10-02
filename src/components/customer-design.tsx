"use client";

import { useState } from "react";
import type { StoredSection } from "@/lib/design";
import { isIncluded, sectionDefinition } from "@/lib/sections";

export function CustomerDesign({
  accountName,
  opportunityName,
  sections,
}: {
  accountName: string;
  opportunityName: string;
  sections: StoredSection[];
}) {
  const [index, setIndex] = useState(0);
  const section = sections[index];
  const definition = section ? sectionDefinition(section.id) : null;
  const included = section ? isIncluded(section.status) : false;

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <nav aria-label="Design sections">
        <ol className="space-y-2">
          {sections.map((item, itemIndex) => {
            const itemDefinition = sectionDefinition(item.id);
            const previous = itemIndex > 0 ? sectionDefinition(sections[itemIndex - 1].id) : null;
            const showGroup = !previous || previous.group !== itemDefinition.group;
            const ready = isIncluded(item.status);
            return (
              <li key={item.id}>
                {showGroup ? <p className="px-3 pt-3 text-sm font-bold">{itemDefinition.group}</p> : null}
                <button
                  type="button"
                  aria-current={itemIndex === index ? "true" : undefined}
                  onClick={() => setIndex(itemIndex)}
                  className={`w-full rounded-md px-3 py-2 text-left ${
                    itemIndex === index ? "bg-[var(--line)]" : "hover:bg-[var(--line)]"
                  }`}
                >
                  <span className="block">{itemDefinition.label}</span>
                  <span className="text-xs text-[var(--granicus-dark-blue)]">
                    {ready ? "Ready" : "In progress"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      {section && definition ? (
        <article>
          <p className="text-sm font-bold text-[var(--granicus-dark-red)]">{accountName}</p>
          <h1 className="mt-2 text-4xl">{definition.label}</h1>
          <p className="mt-1 text-[var(--ink)]/60">{opportunityName}</p>
          {included ? (
            <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed">{section.content}</div>
          ) : (
            <p className="mt-8 text-lg leading-relaxed">
              This section is still being prepared and is not part of the shared design yet.
            </p>
          )}
          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
              disabled={index === 0}
              className="h-11 rounded-md border border-[var(--line)] px-4 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setIndex((current) => Math.min(sections.length - 1, current + 1))}
              disabled={index === sections.length - 1}
              className="h-11 rounded-md bg-[var(--pine)] px-4 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </article>
      ) : null}
    </div>
  );
}
