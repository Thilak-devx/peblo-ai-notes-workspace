import axios from "axios";
import { clientEnv } from "@/config/env";

export const api = axios.create({
  baseURL: clientEnv.apiUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
