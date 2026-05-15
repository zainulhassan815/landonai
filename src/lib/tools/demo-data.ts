/**
 * Hand-seeded comparison data used by the static demo pages while the
 * OpenAI Workflow integration is still pending (PRD §10 q2). Once the
 * workflow is wired up these shapes are replaced by `comparisons` /
 * `comparison_files` rows fetched from Supabase.
 */

export type ComparisonStatus = "processing" | "complete" | "failed";

export type ComparisonFile = {
  id: string;
  label: string;
  filename: string;
  sizeBytes: number;
};

export type Comparison = {
  id: string;
  title: string;
  status: ComparisonStatus;
  createdAt: string;
  completedAt?: string;
  durationSeconds?: number;
  files: ComparisonFile[];
};

export const DEMO_COMPARISON: Comparison = {
  id: "demo-001",
  title: "Renewal vs. expiring home policy",
  status: "complete",
  createdAt: "2026-04-15T10:32:00.000Z",
  completedAt: "2026-04-15T10:32:08.000Z",
  durationSeconds: 8,
  files: [
    {
      id: "f1",
      label: "Expiring policy",
      filename: "home-policy-2025.pdf",
      sizeBytes: 2_415_312,
    },
    {
      id: "f2",
      label: "Renewal quote",
      filename: "renewal-quote-2026.pdf",
      sizeBytes: 2_812_416,
    },
    {
      id: "f3",
      label: "Alt. carrier quote",
      filename: "alt-quote-aclins.pdf",
      sizeBytes: 1_982_104,
    },
  ],
};

export const DEMO_HISTORY: Comparison[] = [
  DEMO_COMPARISON,
  {
    id: "demo-002",
    title: "Vendor SaaS contract review",
    status: "complete",
    createdAt: "2026-04-10T15:14:00.000Z",
    completedAt: "2026-04-10T15:14:11.000Z",
    durationSeconds: 11,
    files: [
      {
        id: "f1",
        label: "Original contract",
        filename: "msa-2024.pdf",
        sizeBytes: 1_204_512,
      },
      {
        id: "f2",
        label: "Renewal terms",
        filename: "msa-2026-draft.pdf",
        sizeBytes: 1_312_840,
      },
    ],
  },
  {
    id: "demo-003",
    title: "Property quote — three carriers",
    status: "processing",
    createdAt: "2026-04-16T09:01:00.000Z",
    files: [
      {
        id: "f1",
        label: "Carrier A quote",
        filename: "carrier-a.pdf",
        sizeBytes: 988_421,
      },
      {
        id: "f2",
        label: "Carrier B quote",
        filename: "carrier-b.pdf",
        sizeBytes: 1_104_812,
      },
      {
        id: "f3",
        label: "Carrier C quote",
        filename: "carrier-c.pdf",
        sizeBytes: 1_312_088,
      },
    ],
  },
];

export function findComparison(id: string): Comparison {
  return DEMO_HISTORY.find((row) => row.id === id) ?? DEMO_COMPARISON;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
