"use client";

import { createContext, useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  fetchCurrentUserRequest,
  loginRequest,
  logoutRequest,
  signupRequest,
} from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { AuthUser } from "@/types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const restoreSession = useEffectEvent(async () => {
    try {
      const response = await fetchCurrentUserRequest();
      setUser(response?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  });

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) {
        return;
      }

      await restoreSession();
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isBootstrapping || !user) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void restoreSession();
      }
    };

    const handleFocus = () => {
      void restoreSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isBootstrapping, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      async login(payload) {
        try {
          const response = await loginRequest(payload);
          setUser(response.user);
          return response.user;
        } catch (error) {
          throw new Error(getApiErrorMessage(error, "Unable to sign in"));
        }
      },
      async signup(payload) {
        try {
          const response = await signupRequest(payload);
          setUser(response.user);
          return response.user;
        } catch (error) {
          throw new Error(getApiErrorMessage(error, "Unable to create account"));
        }
      },
      async logout() {
        try {
          await logoutRequest();
        } finally {
          setUser(null);
        }
      },
    }),
    [isBootstrapping, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
