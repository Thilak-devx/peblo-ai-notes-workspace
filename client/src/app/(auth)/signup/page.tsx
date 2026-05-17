import { AuthForm } from "@/components/auth/auth-form";
import { GuestGuard } from "@/components/auth/guest-guard";
import { AuthShell } from "@/components/layout/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      title="Stand up a polished signup surface without wiring business logic yet."
      description="This route gives the frontend a clean contract for future validation, auth providers, and workspace onboarding."
    >
      <GuestGuard>
        <AuthForm mode="signup" />
      </GuestGuard>
    </AuthShell>
  );
}
