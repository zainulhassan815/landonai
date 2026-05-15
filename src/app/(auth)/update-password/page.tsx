import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your Landon AI account.",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
