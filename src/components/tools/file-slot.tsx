"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/tools/demo-data";

type FileSlotProps = {
  index: number;
  label: string;
  file: File | null;
  canRemove: boolean;
  onLabelChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onRemoveSlot: () => void;
  disabled?: boolean;
};

export function FileSlot({
  index,
  label,
  file,
  canRemove,
  onLabelChange,
  onFileChange,
  onRemoveSlot,
  disabled,
}: FileSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const labelId = `slot-${index}-label`;

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const dropped = event.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          File {index + 1}
        </span>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemoveSlot}
            disabled={disabled}
            className="text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            Remove
          </button>
        ) : null}
      </div>

      {file ? (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <FileText className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            disabled={disabled}
            aria-label="Remove file"
            className="text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (disabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          aria-disabled={disabled}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-6 text-center transition",
            "hover:border-brand/40 hover:bg-brand-soft/40",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            isDragging && "border-brand bg-brand-soft",
            disabled && "cursor-not-allowed opacity-50 hover:border-border",
          )}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Upload className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-foreground">
            Drop a PDF here
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              const picked = event.target.files?.[0] ?? null;
              if (picked) onFileChange(picked);
              event.target.value = "";
            }}
          />
        </div>
      )}

      <div className="grid gap-1.5">
        <Label htmlFor={labelId} className="text-xs text-muted-foreground">
          Label (optional)
        </Label>
        <Input
          id={labelId}
          type="text"
          placeholder='e.g. "Expiring policy"'
          value={label}
          onChange={(event) => onLabelChange(event.target.value)}
          disabled={disabled}
          maxLength={60}
          className="h-9"
        />
      </div>
    </div>
  );
}
