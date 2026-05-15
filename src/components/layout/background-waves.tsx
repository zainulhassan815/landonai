import { cn } from "@/lib/utils";

const LINE_COUNT = 7;

function WaveLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 220"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.9}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("text-brand/40", className)}
    >
      {Array.from({ length: LINE_COUNT }).map((_, index) => {
        const offset = index * 14;
        const baseY = 40 + offset;
        return (
          <path
            key={index}
            d={`M-20 ${baseY} C 140 ${baseY - 30}, 320 ${baseY + 40}, 620 ${baseY - 10}`}
            opacity={0.55 - index * 0.05}
          />
        );
      })}
    </svg>
  );
}

export function BackgroundWaves() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <WaveLines className="absolute top-[-2%] right-[-8%] hidden h-[55vh] w-[70vw] sm:block" />
      <WaveLines className="absolute bottom-[-6%] left-[-12%] hidden h-[55vh] w-[70vw] -scale-x-100 sm:block" />
    </div>
  );
}
