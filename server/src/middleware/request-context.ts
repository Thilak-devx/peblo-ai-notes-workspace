import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requestContext(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const requestIdHeader = request.headers["x-request-id"];
  const requestId =
    typeof requestIdHeader === "string" && requestIdHeader.trim()
      ? requestIdHeader.trim()
      : crypto.randomUUID();

  request.requestId = requestId;
  response.setHeader("x-request-id", requestId);

  next();
}
