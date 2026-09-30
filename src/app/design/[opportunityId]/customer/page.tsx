import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerDesign } from "@/components/customer-design";
import { getDesign } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function CustomerDesignPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;
  const design = await getDesign(opportunityId);
  if (!design) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <p className="mb-8 text-sm">
        <Link href={`/design/${design.opportunityId}`} className="underline">
          Back to workspace
        </Link>
      </p>
      <CustomerDesign
        accountName={design.accountName}
        opportunityName={design.opportunityName}
        sections={design.sections}
      />
    </main>
  );
}
