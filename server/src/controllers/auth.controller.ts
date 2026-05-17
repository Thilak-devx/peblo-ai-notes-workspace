import type { Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "../utils/auth";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sanitizeUser(user: { _id: unknown; name: string; email: string; createdAt?: Date; updatedAt?: Date }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateSignupInput(body: Request["body"]) {
  const name = body.name?.trim();
  const email = body.email?.trim();
  const password = body.password?.trim();

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  if (name.length > 80) {
    throw new ApiError(400, "Name must be 80 characters or fewer");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  return {
    name,
    email: normalizeEmail(email),
    password,
  };
}

function validateLoginInput(body: Request["body"]) {
  const email = body.email?.trim();
  const password = body.password?.trim();

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  return {
    email: normalizeEmail(email),
    password,
  };
}

export const signup = asyncHandler(async (request: Request, response: Response) => {
  const { name, email, password } = validateSignupInput(request.body);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = signAuthToken({ userId: String(user._id) });
  setAuthCookie(response, token);

  response.status(201).json({
    status: "success",
    message: "Account created successfully",
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  const { email, password } = validateLoginInput(request.body);
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAuthToken({ userId: String(user._id) });
  setAuthCookie(response, token);

  response.status(200).json({
    status: "success",
    message: "Logged in successfully",
    user: sanitizeUser(user),
  });
});

export const logout = asyncHandler(async (_request: Request, response: Response) => {
  clearAuthCookie(response);

  response.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const getCurrentUser = asyncHandler(async (request: Request, response: Response) => {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  response.status(200).json({
    status: "success",
    user: sanitizeUser(request.user),
  });
});
