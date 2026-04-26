import Image from "next/image";
import { cn } from "@/lib/utils";

const INVESTORS = [
  {
    name: "Primer",
    src: "/logo/primer_logo.png",
    width: 691,
    height: 201,
    /** Primer's wordmark is brand navy — render as-is in both modes. */
    whiteOnDark: false,
  },
  {
    name: "해시드",
    src: "/logo/hashed_logo.png",
    width: 1862,
    height: 472,
    /** Hashed asset is pure white; darken for light mode. */
    whiteOnDark: true,
  },
] as const;

export function InvestorsSection() {
  return (
    <section
      id="investors"
      className="scroll-mt-24 border-t border-border-subtle py-10 sm:py-14"
    >
      <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
        Backed by
      </h3>
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">
        {INVESTORS.map((inv) => (
          <li key={inv.name} className="h-7 sm:h-8">
            <Image
              src={inv.src}
              alt={inv.name}
              width={inv.width}
              height={inv.height}
              className={cn(
                "h-full w-auto opacity-80 transition-opacity hover:opacity-100",
                inv.whiteOnDark && "brightness-0 dark:brightness-100"
              )}
              sizes="(min-width: 640px) 180px, 140px"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
