import { describe, expect, it, vi } from "vitest";
import { fetchGongTranscripts, parseMcpBody, textFromMcpPayload } from "./gong";

describe("gong mcp parsing", () => {
  it("reads text content from a tool result", () => {
    const text = textFromMcpPayload({
      result: { content: [{ type: "text", text: "The inbox is the queue." }] },
    });
    expect(text).toBe("The inbox is the queue.");
  });

  it("parses server-sent events", () => {
    const messages = parseMcpBody('data: {"result":{"content":[{"type":"text","text":"Call one"}]}}\n\n');
    expect(textFromMcpPayload(messages[0])).toBe("Call one");
  });

  it("stays unconfigured until the tool contract is set", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const result = await fetchGongTranscripts("006000000000001AAA", fetchImpl, {});
    expect(result.status).toBe("unconfigured");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("calls the configured tool with the opportunity argument", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async (_input, init) => {
      const body = JSON.parse(String(init?.body)) as { method?: string };
      if (body.method === "initialize") {
        return new Response("{}", { status: 200, headers: { "mcp-session-id": "session-1" } });
      }
      if (body.method === "notifications/initialized") {
        return new Response(null, { status: 202 });
      }
      return new Response(
        JSON.stringify({ result: { content: [{ type: "text", text: "Transcript body" }] } }),
        { status: 200 },
      );
    });

    const result = await fetchGongTranscripts("006000000000001AAA", fetchImpl, {
      GONG_MCP_URL: "https://gong.example/mcp",
      GONG_MCP_TOOL: "get_transcripts",
      GONG_MCP_OPPORTUNITY_ARGUMENT: "opportunityId",
    });

    expect(result).toEqual({ status: "ready", text: "Transcript body" });
    const call = fetchImpl.mock.calls[2];
    const payload = JSON.parse(String(call?.[1]?.body)) as {
      params: { name: string; arguments: Record<string, string> };
    };
    expect(payload.params.name).toBe("get_transcripts");
    expect(payload.params.arguments.opportunityId).toBe("006000000000001AAA");
    expect(new Headers(call?.[1]?.headers).get("mcp-session-id")).toBe("session-1");
  });
});
