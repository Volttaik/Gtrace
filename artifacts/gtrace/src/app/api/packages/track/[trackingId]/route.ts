import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    await connectMongoDB();
    const { trackingId } = await params;
    const pkg = await PackageModel.findOne({ trackingId });
    if (!pkg) {
      return NextResponse.json(
        { error: "not_found", message: "Package not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      trackingId: pkg.trackingId,
      name: pkg.name,
      description: pkg.description,
      status: pkg.status,
      sender: pkg.sender,
      recipient: pkg.recipient,
      origin: pkg.origin,
      destination: pkg.destination,
      currentLocation: pkg.currentLocation,
      estimatedDelivery: pkg.estimatedDelivery,
      totalDistance: pkg.totalDistance,
      distanceTravelled: pkg.distanceTravelled,
      history: pkg.history,
      scheduledMove: pkg.scheduledMove,
    });
  } catch (err) {
    console.error("Error tracking package", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
