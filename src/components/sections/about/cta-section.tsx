import Link from "next/link";
import { Footer } from "@/components/footer";

/**
 * Last snap section. Mirrors home's closing pattern: CTA content fills
 * the viewport via `flex-1`, and the Footer sits at the bottom of the
 * same snap target so both beats land in one screen.
 */
export function CtaSection() {
  return (
    <section id="cta" className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <div className="rounded-3xl border border-border-subtle bg-bg-elev-1 px-8 py-12 sm:px-14 sm:py-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
            Start now
          </p>
          <h2 className="text-[30px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[40px] lg:text-[48px]">
            AI의 답이 되는 자리, 지금 선점하세요
          </h2>
          <p className="mt-6 max-w-[580px] text-[17px] leading-[1.75] text-text-muted">
            SEO가 그랬듯 GEO도 곧 기준이 됩니다.
            <br />
            먼저 움직인 브랜드가 AI의 답에 먼저 이름을 올립니다.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium transition-colors hover:bg-bg-elev-2"
            >
              문의 보내기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
