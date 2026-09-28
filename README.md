# Panda

Solution design workspace for a consultant.

The consultant enters a customer name, picks a matching opportunity, and walks a fixed design: future outcome, current state, future state, success measure, and workflow. Values already stored on the Salesforce solution design are shown as filled. Empty sections are drafted from Gong transcripts and the Salesforce opportunity, then edited here. Nothing is written back to Salesforce.

From an accepted design the consultant can open a customer view, download a PDF, or download slide-ready text (title, body, and speaker notes) for an existing PowerPoint template.

## Run

```bash
npm install
npm run dev
```

Open the app and search for `Northwind Commerce` when Salesforce is not connected. That path uses sample opportunities.

## Connect Salesforce and Gong

Copy `.env.example` to `.env.local`.

Salesforce is read with either `SALESFORCE_INSTANCE_URL` and `SALESFORCE_ACCESS_TOKEN`, or the password grant variables. Opportunity search uses the standard Opportunity and Account fields.

The solution design object is mapped in `src/lib/salesforce-section-map.ts`. Leave it empty until the object and field API names are known. Unmapped sections start as drafts.

Gong is called through the MCP server in `GONG_MCP_URL`. Set `GONG_MCP_TOOL` and `GONG_MCP_OPPORTUNITY_ARGUMENT` to the tool contract. Until those are set, drafts use Salesforce opportunity data only.

When `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` is present, empty sections are drafted with `openai/gpt-5.4` through the AI Gateway. Otherwise the draft is assembled directly from the source text.
