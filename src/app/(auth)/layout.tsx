import Link from "next/link";
import { BackgroundWaves } from "@/components/layout/background-waves";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <BackgroundWaves />
      <header className="relative">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-6">
          <Link
            href="/"
            aria-label="Landon AI home"
            className="flex items-center gap-2.5 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Logo className="size-8" />
            <span className="text-base font-semibold text-foreground">
              Landon AI
            </span>
          </Link>
        </div>
      </header>
      <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
