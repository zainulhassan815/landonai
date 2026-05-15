"use client";

import { useState, useTransition } from "react";
import { MailCheck } from "lucide-react";
import { submitContactForm } from "@/app/(app)/contact/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_LIMITS } from "@/lib/contact/validate";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consultation, setConsultation] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [didSubmit, setDidSubmit] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitContactForm({
        name,
        email,
        message,
        consultation,
        honeypot,
      });
      if (result.ok) {
        setDidSubmit(true);
        return;
      }
      setError(result.error);
    });
  }

  if (didSubmit) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <MailCheck className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Message received
          </h2>
          <p className="text-sm text-muted-foreground">
            Thanks for reaching out — we&apos;ll be in touch within one business
            day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.nameMax}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={CONTACT_LIMITS.emailMax}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={CONTACT_LIMITS.messageMin}
          maxLength={CONTACT_LIMITS.messageMax}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="consultation"
          checked={consultation}
          onCheckedChange={(value) => setConsultation(value === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="consultation"
          className="text-sm leading-snug font-normal text-muted-foreground"
        >
          I&apos;m interested in a consulting conversation, not just product
          support.
        </Label>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full sm:w-auto sm:self-start"
        disabled={isPending}
      >
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
