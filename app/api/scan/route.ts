import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const token = formData.get("token");
    const userId = formData.get("userId");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("file", file, (file as File).name || "live_recording.wav");
    if (token && typeof token === "string") backendFormData.append("token", token);
    if (userId && typeof userId === "string") backendFormData.append("userId", userId);

    const response = await fetch(`${BACKEND_URL}/upload-audio`, {
      method: "POST",
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return NextResponse.json(
        { error: "Backend analysis failed", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to analysis backend. Is the Python server running on port 8000?" },
      { status: 502 }
    );
  }
}
