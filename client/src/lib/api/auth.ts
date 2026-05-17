import { api } from "@/lib/api/axios";
import {
  parseAuthResponse,
  parseAuthStatusResponse,
} from "@/lib/api/contracts";
import { toApiClientError } from "@/lib/api/errors";

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export async function loginRequest(payload: LoginPayload) {
  try {
    const response = await api.post("/auth/login", payload);
    return parseAuthResponse(response.data);
  } catch (error) {
    throw toApiClientError(error, "Unable to sign in");
  }
}

export async function signupRequest(payload: SignupPayload) {
  try {
    const response = await api.post("/auth/signup", payload);
    return parseAuthResponse(response.data);
  } catch (error) {
    throw toApiClientError(error, "Unable to create account");
  }
}

export async function logoutRequest() {
  try {
    const response = await api.post("/auth/logout");
    return parseAuthStatusResponse(response.data);
  } catch (error) {
    throw toApiClientError(error, "Unable to log out");
  }
}

export async function fetchCurrentUserRequest() {
  try {
    const response = await api.get("/auth/me");
    return parseAuthResponse(response.data);
  } catch (error) {
    const normalizedError = toApiClientError(error, "Unable to restore your session");

    if (normalizedError.statusCode === 401) {
      return null;
    }

    throw normalizedError;
  }
}
