import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NOTES_API_URL}/api/notas`,
      { cache: "no-store" }
    );

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo conectar a la API de notas" },
      { status: 502 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(
      `${process.env.NOTES_API_URL}/api/notas`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo conectar a la API de notas" },
      { status: 502 }
    );
  }
}
