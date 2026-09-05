import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // We'll throw an error only when a connection is actually attempted in production,
  // but during build time this file might be imported, so we just log a warning.
  console.warn("Please define the MONGODB_URI environment variable inside .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4, // Force IPv4 to prevent MongoNetworkError on some networks
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
