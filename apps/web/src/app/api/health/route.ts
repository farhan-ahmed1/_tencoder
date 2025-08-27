import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Health check failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to connect to API" },
      { status: 503 }
    );
  }
}
