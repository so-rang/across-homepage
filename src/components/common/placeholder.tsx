import { cn } from "@/lib/utils";

type PlaceholderProps = {
  label: string;
  className?: string;
  aspect?: "1/1" | "16/9" | "4/3" | "3/4";
};

/**
 * Asset-slot placeholder — replaces missing brand visuals until blockers
 * (B01–B04) are cleared. Communicates intent without mock content.
 */
export function Placeholder({
  label,
  className,
  aspect = "4/3",
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-xl border border-dashed border-border-subtle bg-bg-elev-1 text-xs uppercase tracking-[0.24em] text-text-muted",
        className
      )}
      style={{ aspectRatio: aspect }}
    >
      {label}
    </div>
  );
}
