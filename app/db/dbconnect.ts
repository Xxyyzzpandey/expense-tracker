

import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("✅ Database connected successfully:", connection.isConnected);
  } catch (error) {
    console.error(" Database connection failed:", error);
    throw new Error("Database connection failed");
  }
}

export default dbConnect;
