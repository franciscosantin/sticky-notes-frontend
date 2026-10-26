
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.text();

    const response = await fetch(
      `${process.env.NOTES_API_URL}/api/notas/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
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

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const response = await fetch(
      `${process.env.NOTES_API_URL}/api/notas/${encodeURIComponent(id)}`,
      { method: "DELETE" }
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
