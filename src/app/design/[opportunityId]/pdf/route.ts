import { notFound } from "next/navigation";
import { renderDesignPdf } from "@/lib/pdf";
import { downloadFileName } from "@/lib/slides";
import { getDesign } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ opportunityId: string }> },
) {
  const { opportunityId } = await context.params;
  const design = await getDesign(opportunityId);
  if (!design) {
    notFound();
  }
  const bytes = await renderDesignPdf(design);
  const fileName = downloadFileName(design.accountName, "solution-design.pdf");
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
