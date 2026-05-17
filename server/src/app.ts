import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { requestContext } from "./middleware/request-context";
import { applySecurityHeaders } from "./middleware/security";
import { apiRouter } from "./routes";
import { ApiError } from "./utils/api-error";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestContext);
  app.use(applySecurityHeaders);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || origin === env.CLIENT_URL) {
          callback(null, true);
          return;
        }

        callback(new ApiError(403, "CORS origin denied"));
      },
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
