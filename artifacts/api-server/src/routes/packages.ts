import { Router, type IRouter } from "express";
import { PackageModel } from "../models/Package";
import { generateTrackingId } from "../lib/trackingId";
import { haversineDistance } from "../lib/distance";
import { searchLocations } from "../lib/locations";

const router: IRouter = Router();

// Public: Track a package by tracking ID
router.get("/track/:trackingId", async (req, res) => {
  try {
    const pkg = await PackageModel.findOne({ trackingId: req.params.trackingId });
    if (!pkg) {
      res.status(404).json({ error: "not_found", message: "Package not found" });
      return;
    }
    res.json({
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
    req.log.error({ err }, "Error tracking package");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Search locations
router.get("/locations/search", (req, res) => {
  const q = String(req.query["q"] || "");
  const results = searchLocations(q);
  res.json({ locations: results });
});

// Admin: List all packages
router.get("/admin/packages", async (req, res) => {
  try {
    const packages = await PackageModel.find().sort({ createdAt: -1 });
    res.json({ packages });
  } catch (err) {
    req.log.error({ err }, "Error listing packages");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Admin: Get a single package
router.get("/admin/packages/:id", async (req, res) => {
  try {
    const pkg = await PackageModel.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ error: "not_found", message: "Package not found" });
      return;
    }
    res.json(pkg);
  } catch (err) {
    req.log.error({ err }, "Error getting package");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Admin: Create a package
router.post("/admin/packages", async (req, res) => {
  try {
    const body = req.body;
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
    res.status(201).json(pkg);
  } catch (err) {
    req.log.error({ err }, "Error creating package");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Admin: Update a package
router.put("/admin/packages/:id", async (req, res) => {
  try {
    const body = req.body;
    const pkg = await PackageModel.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ error: "not_found", message: "Package not found" });
      return;
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
      req.params.id,
      { $set: body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating package");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Admin: Delete a package
router.delete("/admin/packages/:id", async (req, res) => {
  try {
    const pkg = await PackageModel.findByIdAndDelete(req.params.id);
    if (!pkg) {
      res.status(404).json({ error: "not_found", message: "Package not found" });
      return;
    }
    res.json({ success: true, message: "Package deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting package");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Admin: Update current location
router.put("/admin/packages/:id/location", async (req, res) => {
  try {
    const body = req.body;
    const pkg = await PackageModel.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ error: "not_found", message: "Package not found" });
      return;
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
      req.params.id,
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
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating location");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

// Admin: Schedule move
router.post("/admin/packages/:id/schedule-move", async (req, res) => {
  try {
    const body = req.body;
    const pkg = await PackageModel.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ error: "not_found", message: "Package not found" });
      return;
    }

    const scheduledAt = new Date().toISOString();
    const arrivalDate = new Date(Date.now() + body.arrivesInDays * 24 * 60 * 60 * 1000).toISOString();

    const scheduledMove = {
      targetLocation: body.targetLocation,
      scheduledAt,
      arrivesInDays: body.arrivesInDays,
      arrivalDate,
    };

    const updated = await PackageModel.findByIdAndUpdate(
      req.params.id,
      { $set: { scheduledMove } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error scheduling move");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
