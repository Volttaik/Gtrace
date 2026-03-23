import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;

  const raw = process.env["MONGODB_URL"] || process.env["MONGODB_URI"];
  if (!raw) {
    throw new Error("MONGODB_URL environment variable is required");
  }

  const url = raw.includes("=") && !raw.startsWith("mongodb")
    ? raw.slice(raw.indexOf("=") + 1).trim()
    : raw.trim();

  await mongoose.connect(url);
  isConnected = true;
  logger.info("MongoDB connected");
}

export { mongoose };
