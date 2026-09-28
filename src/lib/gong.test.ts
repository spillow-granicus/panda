import { describe, expect, it, vi } from "vitest";
import { fetchGongDealAnswer, parseMcpBody, textFromMcpPayload } from "./gong";

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

  it("stays quiet until the existing connection's access token is present", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const result = await fetchGongDealAnswer(
      { crmDeal: "006000000000001AAA", question: "What is the current state?" },
      fetchImpl,
      {},
    );
    expect(result.status).toBe("unconfigured");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("calls ask_deal on the Gong MCP server with the opportunity id", async () => {
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

    const result = await fetchGongDealAnswer(
      { crmDeal: "006000000000001AAA", question: "What is the current state?" },
      fetchImpl,
      {
        GONG_MCP_URL: "https://mcp.gong.io/mcp",
        GONG_MCP_TOKEN: "token",
      },
    );

    expect(result).toEqual({ status: "ready", text: "Transcript body" });
    const call = fetchImpl.mock.calls[2];
    expect(String(call?.[0])).toBe("https://mcp.gong.io/mcp");
    const payload = JSON.parse(String(call?.[1]?.body)) as {
      params: { name: string; arguments: { crmDeal: string; question: string; includeSources: boolean } };
    };
    expect(payload.params.name).toBe("ask_deal");
    expect(payload.params.arguments.crmDeal).toBe("006000000000001AAA");
    expect(payload.params.arguments.question).toBe("What is the current state?");
    expect(payload.params.arguments.includeSources).toBe(true);
    expect(new Headers(call?.[1]?.headers).get("mcp-session-id")).toBe("session-1");
    expect(new Headers(call?.[1]?.headers).get("authorization")).toBe("Bearer token");
  });
});
