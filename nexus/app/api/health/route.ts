import { NextResponse } from "next/server";

/** Sin DB ni auth: solo para probes de Kubernetes / balanceadores. */
export function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
