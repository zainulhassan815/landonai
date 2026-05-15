import { BackgroundWaves } from "@/components/layout/background-waves";
import { TopNav } from "@/components/layout/top-nav";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <BackgroundWaves />
      <TopNav />
      <main className="relative flex-1">{children}</main>
    </div>
  );
}
