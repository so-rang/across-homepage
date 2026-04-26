import { Stage } from "@/components/background/stage";
import { Footer } from "@/components/footer";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";

/**
 * (article) layout — blog detail pages (DESIGN.md §8.5).
 * Reading mode: background stays but dimmed via `.article-dim` on body wrapper.
 * Footer visible.
 */
export default function ArticleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="article-dim relative flex min-h-dvh flex-col">
      <Stage />
      <ZoomOutGesture backHref="/" />
      <main className="relative z-40 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
