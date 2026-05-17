import { AuthForm } from "@/components/auth/auth-form";
import { GuestGuard } from "@/components/auth/guest-guard";
import { AuthShell } from "@/components/layout/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      loginDarkTile
      title="Launch the login experience before the auth logic lands."
      description="The page structure, styling system, and future-ready form shell are already in place for the product team."
    >
      <GuestGuard>
        <AuthForm mode="login" />
      </GuestGuard>
    </AuthShell>
  );
}
