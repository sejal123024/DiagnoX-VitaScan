import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "anonymous";
    const token = searchParams.get("token") || "";

    const response = await fetch(
      `${BACKEND_URL}/reports?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );

    if (!response.ok) {
      return NextResponse.json([], { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Reports proxy error:", error);
    return NextResponse.json([], { status: 502 });
  }
}
