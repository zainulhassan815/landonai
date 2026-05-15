import type { Metadata } from "next";
import Link from "next/link";
import {
  Database,
  FileSearch,
  MessageSquare,
  Network,
  Repeat,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureTile } from "@/components/ui/feature-tile";

export const metadata: Metadata = {
  title: "Consulting",
  description:
    "Practical AI consulting for document-heavy and repetitive workflows.",
};

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICES: readonly Service[] = [
  {
    icon: Sparkles,
    title: "Reduce manual work",
    description: "Repetitive tasks become one-click actions your team can run.",
  },
  {
    icon: FileSearch,
    title: "Speed up document review",
    description:
      "Compare contracts, policies, and quotes side-by-side in seconds.",
  },
  {
    icon: Repeat,
    title: "Improve repetitive workflows",
    description: "Identify what you do every week and turn it into a workflow.",
  },
  {
    icon: Database,
    title: "Reduce data entry",
    description:
      "Pull structured data out of PDFs and spreadsheets automatically.",
  },
  {
    icon: Network,
    title: "Improve internal processes",
    description:
      "Map how work flows through your team and remove the friction.",
  },
  {
    icon: MessageSquare,
    title: "Support client communication",
    description:
      "Generate proposals, summaries, and follow-ups your clients can read.",
  },
  {
    icon: Wrench,
    title: "Build practical AI tools",
    description:
      "Custom internal tools designed for your specific workflows — not generic chatbots.",
  },
];

export default function ConsultingPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24 sm:pt-24">
      <header className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Consulting
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Practical AI for the work your team is doing manually today.
        </p>
      </header>

      <ul className="mx-auto mt-16 grid max-w-3xl gap-x-12 gap-y-10 sm:grid-cols-2">
        {SERVICES.map(({ icon, title, description }) => (
          <li key={title}>
            <FeatureTile icon={icon} title={title} description={description} />
          </li>
        ))}
      </ul>

      <div className="mt-16 flex justify-center">
        <Button asChild size="lg">
          <Link href="/contact">Talk to us</Link>
        </Button>
      </div>
    </div>
  );
}
