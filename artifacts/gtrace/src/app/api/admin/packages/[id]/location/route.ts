import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";
import { haversineDistance } from "@/server/distance";

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

    const distanceTravelled = haversineDistance(
      pkg.origin.lat,
      pkg.origin.lng,
      body.location.lat,
      body.location.lng
    );

    const event = {
      location: body.location,
      timestamp: new Date().toISOString(),
      status: body.status || pkg.status,
      description: body.description || `Package arrived at ${body.location.name}`,
    };

    const updated = await PackageModel.findByIdAndUpdate(
      id,
      {
        $set: {
          currentLocation: body.location,
          status: body.status || pkg.status,
          distanceTravelled,
        },
        $push: { history: event },
      },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating location", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
