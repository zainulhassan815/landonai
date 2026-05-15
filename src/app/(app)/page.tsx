import { BookText, Briefcase, Mail, Tag, Users } from "lucide-react";
import { NavCard } from "@/components/ui/nav-card";

const NAV_ITEMS = [
  { href: "/tools", label: "Tools", icon: Briefcase },
  { href: "/consulting", label: "Consulting", icon: Users },
  { href: "/resources", label: "Resources", icon: BookText },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/contact", label: "Contact", icon: Mail },
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-16 pb-24 sm:pt-24">
      <header className="text-center">
        <h1 className="text-6xl font-semibold tracking-tight text-foreground sm:text-7xl">
          Welcome
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose where you&apos;d like to go.
        </p>
      </header>

      <nav
        aria-label="Main sections"
        className="mt-12 flex w-full max-w-xl flex-col gap-4"
      >
        {NAV_ITEMS.map((item) => (
          <NavCard
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>
    </div>
  );
}
