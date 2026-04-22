import { NextRequest, NextResponse } from "next/server";
import { firebaseRequest } from "@/lib/firebase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const body = await req.json();

  await firebaseRequest(`/reservations/${key}`, {
    method: "PATCH",
    body,
  });

  return NextResponse.json({ message: "updated" });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  await firebaseRequest(`/reservations/${key}`, {
    method: "DELETE",
  });

  return NextResponse.json({ message: "deleted" });
}