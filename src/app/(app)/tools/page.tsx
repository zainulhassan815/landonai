import type { Metadata } from "next";
import { FileSearch } from "lucide-react";
import { NavCard } from "@/components/ui/nav-card";

export const metadata: Metadata = {
  title: "Tools",
  description: "AI-powered tools for the work your team is doing manually.",
};

const TOOLS = [
  {
    href: "/tools/pdf-compare",
    label: "PDF Comparison Tool",
    icon: FileSearch,
  },
] as const;

export default function ToolsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-16 pb-24 sm:pt-24">
      <header className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Tools
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Pick a workflow to get started. More tools land here as we build
          them.
        </p>
      </header>

      <nav
        aria-label="Available tools"
        className="mt-12 flex w-full max-w-xl flex-col gap-4"
      >
        {TOOLS.map((tool) => (
          <NavCard
            key={tool.href}
            href={tool.href}
            label={tool.label}
            icon={tool.icon}
          />
        ))}
      </nav>
    </div>
  );
}
