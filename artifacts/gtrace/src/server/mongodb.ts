import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;

declare global {
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectMongoDB() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URL) throw new Error("MONGODB_URL is not set");

  let url = MONGODB_URL.trim();

  if (url.includes("=") && !url.startsWith("mongodb")) {
    url = url.slice(url.indexOf("=") + 1).trim();
  }

  const qIndex = url.indexOf("?");
  const base = qIndex !== -1 ? url.slice(0, qIndex) : url;
  const qs = qIndex !== -1 ? url.slice(qIndex) : "";
  const afterProtocol = base.slice(base.indexOf("//") + 2);
  if ((afterProtocol.match(/\//g) || []).length === 0) {
    url = `${base}/gtrace${qs}`;
  } else {
    url = base.replace(/\/([^/?]*)(\?|$)/, "/gtrace$2") + qs;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(url).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
