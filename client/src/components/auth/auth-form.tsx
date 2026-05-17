"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "signup";
};

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validateForm(mode: "login" | "signup", values: FormValues): FormErrors {
  const nextErrors: FormErrors = {};

  if (mode === "signup" && values.name.trim().length < 2) {
    nextErrors.name = "Enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
  }

  return nextErrors;
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const rawNextPath = searchParams.get("next") || "/dashboard";
  const nextPath =
    rawNextPath.startsWith("/") && !rawNextPath.startsWith("//")
      ? rawNextPath
      : "/dashboard";

  const setField = (field: keyof FormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const nextErrors = validateForm(mode, formValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    startTransition(async () => {
      try {
        if (isLogin) {
          await login({
            email: formValues.email,
            password: formValues.password,
          });
        } else {
          await signup({
            name: formValues.name,
            email: formValues.email,
            password: formValues.password,
          });
        }

        router.replace(nextPath);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to complete your request",
        );
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {isLogin ? "Login page" : "Signup page"}
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
          {isLogin ? "Welcome back" : "Create your workspace"}
        </h2>
        <p className="text-sm leading-7 text-[var(--muted)]">
          {isLogin
            ? "Sign in with your workspace credentials to continue into the product shell."
            : "Create your account to unlock the protected dashboard experience."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {!isLogin ? (
          <Input
            autoComplete="name"
            disabled={isPending}
            error={fieldErrors.name}
            hint="Use the name you want shown across the workspace."
            label="Full name"
            name="name"
            onChange={(value) => setField("name", value)}
            placeholder="Ada Lovelace"
            value={formValues.name}
          />
        ) : null}
        <Input
          autoComplete="email"
          disabled={isPending}
          error={fieldErrors.email}
          hint="We will use this for sign in only."
          label="Email"
          name="email"
          onChange={(value) => setField("email", value)}
          placeholder="you@example.com"
          type="email"
          value={formValues.email}
        />
        <Input
          autoComplete={isLogin ? "current-password" : "new-password"}
          disabled={isPending}
          error={fieldErrors.password}
          hint={isLogin ? "Enter the password linked to your account." : "Use at least 8 characters."}
          label="Password"
          name="password"
          onChange={(value) => setField("password", value)}
          placeholder="Minimum 8 characters"
          type="password"
          value={formValues.password}
        />

        {error ? (
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending
            ? isLogin
              ? "Signing you in..."
              : "Creating account..."
            : isLogin
              ? "Enter dashboard"
              : "Create account"}
        </Button>
      </form>

      <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <span>
          {isLogin ? "Need an account?" : "Already have an account?"}
        </span>
        <Link
          className="font-semibold text-[var(--foreground)]"
          href={
            isLogin
              ? nextPath === "/dashboard"
                ? "/signup"
                : `/signup?next=${encodeURIComponent(nextPath)}`
              : nextPath === "/dashboard"
                ? "/login"
                : `/login?next=${encodeURIComponent(nextPath)}`
          }
        >
          {isLogin ? "Go to signup" : "Go to login"}
        </Link>
      </div>
    </div>
  );
}
