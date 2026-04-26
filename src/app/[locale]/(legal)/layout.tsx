import { Footer } from "@/components/footer";

/**
 * (legal) layout — /privacy, /terms.
 * Minimal background, full Footer.
 */
export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
