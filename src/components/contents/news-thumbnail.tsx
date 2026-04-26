import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  aspect: "1:1" | "16:9";
  /** When the only available thumbnail is the generic placeholder, we render
   * a branded source card instead so the grid doesn't look broken. */
  fallback?: { sourceName: string; date: string };
};

const PLACEHOLDER = "/content/news/placeholder.svg";

/**
 * News thumbnail — real OG image when we have one, otherwise an editorial
 * source card keyed on publisher name (DESIGN.md §8.4 / plan T16).
 */
export function NewsThumbnail({ src, alt, aspect, fallback }: Props) {
  if (src === PLACEHOLDER && fallback) {
    return (
      <div className="relative flex aspect-video items-end overflow-hidden rounded-xl border-b border-border-subtle bg-bg-elev-2 p-6">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-signal-blue/60"
        />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
            Press
          </p>
          <p className="mt-2 text-[22px] font-light leading-[1.2] tracking-[0.01em] text-text">
            {fallback.sourceName}
          </p>
          <p className="mt-1 font-mono text-[12px] text-text-muted">
            {fallback.date}
          </p>
        </div>
      </div>
    );
  }

  const native = aspect === "16:9";
  return (
    <div className="relative overflow-hidden rounded-xl bg-bg-elev-1 [aspect-ratio:16/9]">
      {!native ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 ambient-blur"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </>
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={
          native
            ? "relative object-cover"
            : "relative object-contain"
        }
      />
    </div>
  );
}
