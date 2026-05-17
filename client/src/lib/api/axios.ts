import axios from "axios";
import { clientEnv } from "@/config/env";
import { getStoredAuthToken } from "@/lib/auth-token";

export const api = axios.create({
  baseURL: clientEnv.apiUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});
