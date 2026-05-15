import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset the password for your Landon AI account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
