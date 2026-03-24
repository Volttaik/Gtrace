import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";
import { haversineDistance, lerp } from "@/server/distance";

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

    let currentLocation = pkg.currentLocation.toObject();
    let distanceTravelled: number = pkg.distanceTravelled ?? 0;
    let scheduledMove = pkg.scheduledMove ? pkg.scheduledMove.toObject() : null;

    // --- Live movement engine ---
    if (scheduledMove?.startLocation) {
      const startMs = new Date(scheduledMove.scheduledAt).getTime();
      const endMs   = new Date(scheduledMove.arrivalDate).getTime();
      const nowMs   = Date.now();
      const duration = endMs - startMs;
      const progress = duration > 0
        ? Math.min(1, Math.max(0, (nowMs - startMs) / duration))
        : 1;

      const start  = scheduledMove.startLocation;
      const target = scheduledMove.targetLocation;

      if (progress >= 1) {
        // Journey complete — finalise in DB
        const arrivedDistance = haversineDistance(
          pkg.origin.lat, pkg.origin.lng,
          target.lat, target.lng
        );
        const arrivalEvent = {
          location: target,
          timestamp: new Date().toISOString(),
          status: "in_transit",
          description: `Package arrived at ${target.name}`,
        };
        await PackageModel.findByIdAndUpdate(pkg._id, {
          $set: {
            currentLocation: target,
            scheduledMove: null,
            distanceTravelled: arrivedDistance,
            status: "in_transit",
          },
          $push: { history: arrivalEvent },
        });
        currentLocation  = target;
        distanceTravelled = arrivedDistance;
        scheduledMove    = null;
      } else {
        // In-flight — interpolate lat/lng, keep start location's name
        const interpLat = lerp(start.lat, target.lat, progress);
        const interpLng = lerp(start.lng, target.lng, progress);
        currentLocation = { ...start, lat: interpLat, lng: interpLng };
        distanceTravelled = haversineDistance(
          pkg.origin.lat, pkg.origin.lng,
          interpLat, interpLng
        );
      }
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
      currentLocation,
      estimatedDelivery: pkg.estimatedDelivery,
      totalDistance: pkg.totalDistance,
      distanceTravelled,
      history: pkg.history,
      scheduledMove,
    });
  } catch (err) {
    console.error("Error tracking package", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
