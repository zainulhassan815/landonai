"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileSlot } from "@/components/tools/file-slot";
import { DEMO_COMPARISON } from "@/lib/tools/demo-data";

const MIN_SLOTS = 2;
const MAX_SLOTS = 6;

type Slot = {
  id: number;
  label: string;
  file: File | null;
};

const PROGRESS_STEPS = [
  "Uploading documents…",
  "Extracting structure…",
  "Generating comparison report…",
] as const;

let slotIdCounter = 0;
function emptySlot(): Slot {
  slotIdCounter += 1;
  return { id: slotIdCounter, label: "", file: null };
}

export function PdfCompareForm() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>(() => [emptySlot(), emptySlot()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const filledCount = slots.filter((slot) => slot.file !== null).length;
  const canSubmit = filledCount >= MIN_SLOTS && !isSubmitting;

  useEffect(() => {
    if (!isSubmitting) return;
    if (progressStep >= PROGRESS_STEPS.length - 1) return;
    const timer = setTimeout(() => setProgressStep((step) => step + 1), 500);
    return () => clearTimeout(timer);
  }, [isSubmitting, progressStep]);

  function updateSlot(id: number, patch: Partial<Slot>) {
    setSlots((current) =>
      current.map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)),
    );
  }

  function removeSlot(id: number) {
    setSlots((current) =>
      current.length <= MIN_SLOTS
        ? current
        : current.filter((slot) => slot.id !== id),
    );
  }

  function addSlot() {
    setSlots((current) =>
      current.length >= MAX_SLOTS ? current : [...current, emptySlot()],
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setProgressStep(0);
    setTimeout(() => {
      router.push(`/tools/pdf-compare/${DEMO_COMPARISON.id}`);
    }, 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {slots.map((slot, index) => (
          <FileSlot
            key={slot.id}
            index={index}
            label={slot.label}
            file={slot.file}
            canRemove={slots.length > MIN_SLOTS}
            disabled={isSubmitting}
            onLabelChange={(label) => updateSlot(slot.id, { label })}
            onFileChange={(file) => updateSlot(slot.id, { file })}
            onRemoveSlot={() => removeSlot(slot.id)}
          />
        ))}
      </div>

      {slots.length < MAX_SLOTS ? (
        <button
          type="button"
          onClick={addSlot}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 self-center rounded-full border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-brand/40 hover:text-foreground disabled:opacity-50"
        >
          <Plus className="size-4" strokeWidth={2} />
          Add another file
        </button>
      ) : null}

      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filledCount < MIN_SLOTS
            ? `Add at least ${MIN_SLOTS} PDFs to compare.`
            : `${filledCount} of ${MAX_SLOTS} files ready.`}
        </p>

        {isSubmitting ? (
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Loader2 className="size-4 animate-spin text-brand" />
            <span aria-live="polite">{PROGRESS_STEPS[progressStep]}</span>
          </div>
        ) : (
          <Button type="submit" size="lg" disabled={!canSubmit}>
            <Sparkles className="size-4" strokeWidth={2} />
            Compare
          </Button>
        )}
      </div>
    </form>
  );
}
