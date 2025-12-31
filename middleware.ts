import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("accept", "application/json, text/event-stream");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/mcp", "/mcp/:path*"],
};
