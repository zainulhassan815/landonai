"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ResultActionsProps = {
  copyText: string;
};

export function ResultActions({ copyText }: ResultActionsProps) {
  const router = useRouter();
  const [didCopy, setDidCopy] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setDidCopy(true);
      setTimeout(() => setDidCopy(false), 1800);
    } catch {
      // Clipboard write rejected — silently no-op; user can still export.
    }
  }

  function handleExport() {
    if (typeof window !== "undefined") window.print();
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this comparison? This cannot be undone.",
    );
    if (!confirmed) return;
    router.push("/account");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {didCopy ? (
          <Check className="size-4" strokeWidth={2.5} />
        ) : (
          <Copy className="size-4" strokeWidth={2} />
        )}
        {didCopy ? "Copied" : "Copy report"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Printer className="size-4" strokeWidth={2} />
        Export PDF
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" strokeWidth={2} />
        Delete
      </Button>
    </div>
  );
}
