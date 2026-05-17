import { clientEnv } from "@/config/env";

export const appConfig = {
  name: clientEnv.appName,
  description:
    "Full-stack AI notes workspace for capture, search, summaries, and productivity insights.",
  navigation: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/notes", label: "Notes" },
  ],
  authNavigation: [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Signup" },
  ],
} as const;
