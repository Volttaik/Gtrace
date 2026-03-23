import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/server/locations";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const locations = searchLocations(q);
  return NextResponse.json({ locations });
}
