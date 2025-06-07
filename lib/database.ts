import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}
export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(MONGO_URI!, {
      bufferCommands: false,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
