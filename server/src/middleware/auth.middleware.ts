import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/api-error";
import { extractBearerToken, getAuthCookieName, verifyAuthToken } from "../utils/auth";

export async function protectRoute(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const token =
    request.cookies[getAuthCookieName()] ||
    extractBearerToken(request.header("authorization"));

  if (!token) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  try {
    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.userId).select(
      "_id name email createdAt updatedAt",
    );

    if (!user) {
      next(new ApiError(401, "User session is no longer valid"));
      return;
    }

    request.user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired authentication token"));
  }
}
