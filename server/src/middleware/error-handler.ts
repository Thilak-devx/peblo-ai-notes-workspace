import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/api-error";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  logger.error(`Unhandled application error. requestId=${request.requestId || "unknown"}`, error);

  const baseErrorResponse = {
    status: "error" as const,
    requestId: request.requestId,
  };

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      ...baseErrorResponse,
      message: error.message,
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      ...baseErrorResponse,
      message: Object.values(error.errors)[0]?.message || "Validation failed",
    });
    return;
  }

  if ("code" in error && error.code === 11000) {
    response.status(409).json({
      ...baseErrorResponse,
      message: "A record with this value already exists",
    });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({
      ...baseErrorResponse,
      message: "Malformed JSON request body",
    });
    return;
  }

  response.status(500).json({
    ...baseErrorResponse,
    message: "Internal server error",
    ...(env.NODE_ENV === "development"
      ? {
          error: {
            message: error.message,
          },
        }
      : {}),
  });
}
