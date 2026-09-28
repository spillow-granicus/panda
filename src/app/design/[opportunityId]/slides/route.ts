import { notFound } from "next/navigation";
import { downloadFileName, slideReadyText } from "@/lib/slides";
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
  const fileName = downloadFileName(design.accountName, "slides.txt");
  return new Response(slideReadyText(design), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
