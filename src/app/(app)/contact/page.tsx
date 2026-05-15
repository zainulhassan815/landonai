import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about Landon AI — product questions, demos, or consulting.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 sm:pt-24">
      <header className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Contact
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Tell us a little about what you&apos;re trying to do — we typically
          reply within one business day.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
