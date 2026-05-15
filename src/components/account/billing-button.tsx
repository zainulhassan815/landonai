"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingButton() {
  function handleClick() {
    window.alert(
      "Stripe Customer Portal wires up in Phase 1D. This is the proposal demo.",
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      Manage billing
      <ExternalLink className="size-3.5" strokeWidth={2} aria-hidden="true" />
    </Button>
  );
}
