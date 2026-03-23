import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/server/mongodb";
import { PackageModel } from "@/server/Package";
import { generateTrackingId } from "@/server/trackingId";
import { haversineDistance } from "@/server/distance";

export async function GET() {
  try {
    await connectMongoDB();
    const packages = await PackageModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ packages });
  } catch (err) {
    console.error("Error listing packages", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const trackingId = generateTrackingId();

    const totalDistance = haversineDistance(
      body.origin.lat,
      body.origin.lng,
      body.destination.lat,
      body.destination.lng
    );

    const initialEvent = {
      location: body.origin,
      timestamp: new Date().toISOString(),
      status: body.status || "pending",
      description: `Package registered at ${body.origin.name}`,
    };

    const pkg = new PackageModel({
      trackingId,
      name: body.name,
      description: body.description,
      weight: body.weight,
      dimensions: body.dimensions,
      category: body.category,
      sender: body.sender,
      recipient: body.recipient,
      origin: body.origin,
      destination: body.destination,
      currentLocation: body.origin,
      status: body.status || "pending",
      estimatedDelivery: body.estimatedDelivery,
      totalDistance,
      distanceTravelled: 0,
      history: [initialEvent],
    });

    await pkg.save();
    return NextResponse.json(pkg, { status: 201 });
  } catch (err) {
    console.error("Error creating package", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
