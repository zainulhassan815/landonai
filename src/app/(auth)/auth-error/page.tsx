import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Authentication error",
  description: "Something went wrong while signing you in.",
};

async function ErrorDetail({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message = params?.error;

  return (
    <p className="text-sm text-muted-foreground">
      {message ? <>Details: {message}</> : <>An unspecified error occurred.</>}
    </p>
  );
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <AuthCard
      title="Something went wrong"
      description="We couldn't complete that request."
      footer={
        <>
          Back to{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            sign in
          </Link>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle
            className="size-6"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">Loading…</p>
          }
        >
          <ErrorDetail searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthCard>
  );
}
