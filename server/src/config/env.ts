import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

function resolveEnvPath() {
  // Support running the server from either the repo root or the server workspace.
  const candidatePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "server/.env"),
    path.resolve(__dirname, "../../.env"),
  ];

  return candidatePaths.find((candidatePath) => fs.existsSync(candidatePath));
}

const resolvedEnvPath = resolveEnvPath();

dotenv.config({
  path: resolvedEnvPath,
  quiet: true,
});

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readPort(name: string) {
  const value = readRequiredEnv(name);
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid environment variable: ${name} must be a valid port number`);
  }

  return port;
}

function validateSecret(name: string, minimumLength = 24) {
  const value = readRequiredEnv(name);

  if (value.length < minimumLength) {
    throw new Error(
      `Invalid environment variable: ${name} must be at least ${minimumLength} characters long`,
    );
  }

  return value;
}

function validateNodeEnv(value: string) {
  const normalizedValue = value.trim().toLowerCase();
  const allowedValues = ["development", "test", "production"] as const;

  if (!allowedValues.includes(normalizedValue as (typeof allowedValues)[number])) {
    throw new Error("Invalid environment variable: NODE_ENV must be development, test, or production");
  }

  return normalizedValue as (typeof allowedValues)[number];
}

function validateUrl(name: string) {
  const value = readRequiredEnv(name);

  try {
    const parsedUrl = new URL(value);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    throw new Error(`Invalid environment variable: ${name} must be a valid http or https URL`);
  }
}

function validateUrlList(name: string) {
  const value = readRequiredEnv(name);
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) {
    throw new Error(`Invalid environment variable: ${name} must include at least one valid URL`);
  }

  return [...new Set(items.map((item) => {
    try {
      const parsedUrl = new URL(item);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error();
      }

      return parsedUrl.toString().replace(/\/$/, "");
    } catch {
      throw new Error(`Invalid environment variable: ${name} must contain valid http or https URLs`);
    }
  }))];
}

function validateMongoUri(name: string) {
  const value = readRequiredEnv(name);

  if (!/^mongodb(\+srv)?:\/\//.test(value)) {
    throw new Error(`Invalid environment variable: ${name} must be a valid MongoDB connection string`);
  }

  return value;
}

export const env = {
  PORT: readPort("PORT"),
  MONGO_URI: validateMongoUri("MONGO_URI"),
  JWT_SECRET: validateSecret("JWT_SECRET"),
  GEMINI_API_KEY: readRequiredEnv("GEMINI_API_KEY"),
  CLIENT_URL: validateUrl("CLIENT_URL"),
  CLIENT_URLS: validateUrlList("CLIENT_URL"),
  NODE_ENV: validateNodeEnv(process.env.NODE_ENV?.trim() || "development"),
  ENV_PATH: resolvedEnvPath || null,
} as const;
