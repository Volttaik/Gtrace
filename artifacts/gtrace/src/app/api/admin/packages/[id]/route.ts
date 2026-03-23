import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";
import { haversineDistance } from "@/server/distance";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const pkg = await PackageModel.findById(id);
    if (!pkg) {
      return NextResponse.json(
        { error: "not_found", message: "Package not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(pkg);
  } catch (err) {
    console.error("Error getting package", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    if (body.origin && body.destination) {
      body.totalDistance = haversineDistance(
        body.origin.lat,
        body.origin.lng,
        body.destination.lat,
        body.destination.lng
      );
    }

    const updated = await PackageModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating package", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const pkg = await PackageModel.findByIdAndDelete(id);
    if (!pkg) {
      return NextResponse.json(
        { error: "not_found", message: "Package not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (err) {
    console.error("Error deleting package", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
