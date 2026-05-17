import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    logger.info("MongoDB connection already active.");
    return mongoose.connection;
  }

  try {
    logger.info("Connecting to MongoDB...");

    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      appName: "peblo-ai-notes-workspace-server",
    });

    logger.info("MongoDB connection established successfully.");
    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection failed.", error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info("MongoDB connection closed.");
}

export function registerDatabaseEvents() {
  mongoose.connection.on("disconnected", () => {
    logger.error("MongoDB disconnected unexpectedly.");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected.");
  });

  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection emitted an error.", error);
  });
}
