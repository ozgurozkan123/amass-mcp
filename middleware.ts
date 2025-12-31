import { NextResponse, NextRequest } from "next/server";

// Inject required Accept header for MCP Streamable HTTP if missing.
export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") || "";

  // If text/event-stream is missing, append it to satisfy MCP streamable HTTP requirements
  if (!accept.toLowerCase().includes("text/event-stream")) {
    const headers = new Headers(request.headers);
    if (accept) {
      headers.set("accept", `${accept}, text/event-stream`);
    } else {
      headers.set("accept", "application/json, text/event-stream");
    }
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

// Only run on the MCP endpoint
export const config = {
  matcher: "/mcp",
};
