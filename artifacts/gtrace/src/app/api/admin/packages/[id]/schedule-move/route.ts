import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const body = await req.json();

    const pkg = await PackageModel.findById(id);
    if (!pkg) {
      return NextResponse.json(
        { error: "not_found", message: "Package not found" },
        { status: 404 }
      );
    }

    const scheduledAt = new Date().toISOString();
    const arrivalDate = new Date(
      Date.now() + body.arrivesInDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const scheduledMove = {
      targetLocation: body.targetLocation,
      scheduledAt,
      arrivesInDays: body.arrivesInDays,
      arrivalDate,
    };

    const updated = await PackageModel.findByIdAndUpdate(
      id,
      { $set: { scheduledMove } },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error scheduling move", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
