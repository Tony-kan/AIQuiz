import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI:", MONGO_URI); // Debugging line to check the URI

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the NodeJS.Global interface to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  // 1. If we have a cached connection, return it immediately
  if (cached.conn) {
    console.log("=> using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended for serverless environments
    };

    console.log("=> creating new database connection");
    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    // 3. Await the connection promise and cache the result
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, reset the promise so the next request can try again
    cached.promise = null;
    throw e;
  }

  // 4. Return the established connection
  return cached.conn;
};
