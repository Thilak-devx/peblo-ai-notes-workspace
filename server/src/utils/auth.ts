import type { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AuthUserPayload = {
  userId: string;
};

const cookieName = "token";
const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

export function signAuthToken(payload: AuthUserPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
}

export function setAuthCookie(response: Response, token: string) {
  response.cookie(cookieName, token, {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: sevenDaysInMs,
  });
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(cookieName, {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });
}

export function getAuthCookieName() {
  return cookieName;
}

export function extractBearerToken(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [scheme, token] = value.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}
