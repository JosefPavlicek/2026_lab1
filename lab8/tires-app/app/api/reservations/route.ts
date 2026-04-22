import { NextRequest, NextResponse } from "next/server";
import { firebaseRequest } from "@/lib/firebase";

export async function GET() {
  const data = await firebaseRequest("/reservations");
  return NextResponse.json(data || {});
}

export async function POST(req: NextRequest) {
  const { key, data } = await req.json();

  await firebaseRequest(`/reservations/${key}`, {
    method: "PUT",
    body: data,
  });

  return NextResponse.json({ message: "created" });
}