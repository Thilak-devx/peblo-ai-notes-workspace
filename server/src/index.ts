import { createApp } from "./app";
import {
  connectToDatabase,
  disconnectFromDatabase,
  registerDatabaseEvents,
} from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = createApp();

async function bootstrap() {
  try {
    logger.info(`Environment configuration loaded from ${env.ENV_PATH || "process environment only"}.`);
    await connectToDatabase();
    registerDatabaseEvents();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on http://localhost:${env.PORT}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down server.`);
      server.close(async () => {
        await disconnectFromDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    logger.error("Server startup aborted because MongoDB is unavailable.", error);
    process.exit(1);
  }
}

void bootstrap();
