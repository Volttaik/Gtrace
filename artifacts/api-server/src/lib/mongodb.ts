import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;

  const url = process.env["MONGODB_URL"];
  if (!url) {
    throw new Error("MONGODB_URL environment variable is required");
  }

  await mongoose.connect(url);
  isConnected = true;
  logger.info("MongoDB connected");
}

export { mongoose };
