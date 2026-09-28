export type GongTranscripts =
  | { status: "unconfigured"; text: "" }
  | { status: "ready"; text: string }
  | { status: "error"; text: ""; message: string };

type GongConfig = {
  url: string;
  tool: string;
  opportunityArgument: string;
  token: string | null;
};

export function readGongConfig(
  env: Record<string, string | undefined> = process.env,
): GongConfig | null {
  const url = env.GONG_MCP_URL?.trim();
  const tool = env.GONG_MCP_TOOL?.trim();
  const opportunityArgument = env.GONG_MCP_OPPORTUNITY_ARGUMENT?.trim();
  if (!url || !tool || !opportunityArgument) {
    return null;
  }
  return {
    url,
    tool,
    opportunityArgument,
    token: env.GONG_MCP_TOKEN?.trim() || null,
  };
}

function textFromContent(content: unknown): string {
  if (!Array.isArray(content)) {
    return "";
  }
  const parts: string[] = [];
  for (const item of content) {
    if (!item || typeof item !== "object") {
      continue;
    }
    if ("text" in item && typeof item.text === "string") {
      parts.push(item.text);
    }
  }
  return parts.join("\n\n").trim();
}

export function textFromMcpPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  if ("result" in payload) {
    const result = payload.result;
    if (result && typeof result === "object" && "content" in result) {
      return textFromContent(result.content);
    }
  }
  if ("content" in payload) {
    return textFromContent(payload.content);
  }
  return "";
}

export function parseMcpBody(body: string): unknown[] {
  const trimmed = body.trim();
  if (!trimmed) {
    return [];
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed) as unknown;
    return Array.isArray(parsed) ? parsed : [parsed];
  }
  const messages: unknown[] = [];
  for (const line of trimmed.split(/\r?\n/)) {
    const data = line.startsWith("data:") ? line.slice(5).trim() : "";
    if (!data || data === "[DONE]") {
      continue;
    }
    messages.push(JSON.parse(data) as unknown);
  }
  return messages;
}

async function postMcp(
  config: GongConfig,
  body: unknown,
  sessionId: string | null,
  fetchImpl: typeof fetch,
): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  });
  if (config.token) {
    headers.set("Authorization", `Bearer ${config.token}`);
  }
  if (sessionId) {
    headers.set("mcp-session-id", sessionId);
  }
  return fetchImpl(config.url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function fetchGongTranscripts(
  opportunityId: string,
  fetchImpl: typeof fetch = fetch,
  env: Record<string, string | undefined> = process.env,
): Promise<GongTranscripts> {
  const config = readGongConfig(env);
  if (!config) {
    return { status: "unconfigured", text: "" };
  }

  try {
    const initialize = await postMcp(
      config,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "panda", version: "0.1.0" },
        },
      },
      null,
      fetchImpl,
    );
    if (!initialize.ok) {
      return { status: "error", text: "", message: `Gong MCP initialize failed (${initialize.status}).` };
    }
    const sessionId = initialize.headers.get("mcp-session-id");
    await postMcp(
      config,
      { jsonrpc: "2.0", method: "notifications/initialized" },
      sessionId,
      fetchImpl,
    );
    const call = await postMcp(
      config,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: config.tool,
          arguments: { [config.opportunityArgument]: opportunityId },
        },
      },
      sessionId,
      fetchImpl,
    );
    if (!call.ok) {
      return { status: "error", text: "", message: `Gong MCP call failed (${call.status}).` };
    }
    const messages = parseMcpBody(await call.text());
    const text = messages.map((message) => textFromMcpPayload(message)).filter(Boolean).join("\n\n").trim();
    return { status: "ready", text };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gong MCP call failed.";
    return { status: "error", text: "", message };
  }
}
