import { mongoose } from "../lib/mongodb";

const { Schema, model, models } = mongoose;

const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["city", "port", "airport", "country", "warehouse"],
      required: true,
    },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const LocationEventSchema = new Schema(
  {
    location: { type: LocationSchema, required: true },
    timestamp: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ScheduledMoveSchema = new Schema(
  {
    targetLocation: { type: LocationSchema, required: true },
    scheduledAt: { type: String, required: true },
    arrivesInDays: { type: Number, required: true },
    arrivalDate: { type: String, required: true },
  },
  { _id: false }
);

const PackageSchema = new Schema(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: String },
    dimensions: { type: String },
    category: { type: String },
    sender: { type: String },
    recipient: { type: String },
    origin: { type: LocationSchema, required: true },
    destination: { type: LocationSchema, required: true },
    currentLocation: { type: LocationSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "in_transit", "out_for_delivery", "delivered", "exception"],
      default: "pending",
    },
    estimatedDelivery: { type: String },
    totalDistance: { type: Number, default: 0 },
    distanceTravelled: { type: Number, default: 0 },
    history: { type: [LocationEventSchema], default: [] },
    scheduledMove: { type: ScheduledMoveSchema, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const PackageModel =
  models["Package"] || model("Package", PackageSchema);
