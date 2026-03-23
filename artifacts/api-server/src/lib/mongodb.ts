import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) return;

  const raw = process.env["MONGODB_URL"] || process.env["MONGODB_URI"];
  if (!raw) {
    throw new Error("MONGODB_URL environment variable is required");
  }

  let url = raw.includes("=") && !raw.startsWith("mongodb")
    ? raw.slice(raw.indexOf("=") + 1).trim()
    : raw.trim();

  // Inject dedicated "gtrace" database into the connection URL
  // Atlas URL format: mongodb+srv://user:pass@host/DATABASE?options
  // If no database name is present, insert "gtrace" before the query string
  if (url.includes("mongodb")) {
    const qIndex = url.indexOf("?");
    const base = qIndex !== -1 ? url.slice(0, qIndex) : url;
    const qs = qIndex !== -1 ? url.slice(qIndex) : "";
    // Count slashes after the protocol — 3 means no db name yet (mongodb+srv://user:pass@host)
    const protocolEnd = base.indexOf("//") + 2;
    const afterProtocol = base.slice(protocolEnd);
    const slashCount = (afterProtocol.match(/\//g) || []).length;
    if (slashCount === 0) {
      url = `${base}/gtrace${qs}`;
    } else {
      // Replace existing db name with "gtrace"
      url = base.replace(/\/([^/?]*)(\?|$)/, "/gtrace$2") + qs;
    }
  }

  await mongoose.connect(url);
  isConnected = true;
  logger.info("MongoDB connected");
}

export { mongoose };
