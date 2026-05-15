import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Confirm your email",
  description: "Confirm your email to finish creating your Landon AI account.",
};

export default function SignUpSuccessPage() {
  return (
    <AuthCard
      title="Confirm your email"
      description="We sent a confirmation link to your inbox."
      footer={
        <>
          Already confirmed?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <MailCheck className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your address and finish setting
          up your account. If you don&apos;t see it within a minute, check your
          spam folder.
        </p>
      </div>
    </AuthCard>
  );
}
