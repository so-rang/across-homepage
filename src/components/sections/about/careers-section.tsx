import Link from "next/link";

export function CareersSection() {
  return (
    <section id="careers" className="scroll-mt-24 py-24 sm:py-32">
      <h2 className="mb-8 text-[32px] font-medium leading-[1.4] tracking-[0.01em] text-text sm:text-[44px] sm:leading-[1.3] lg:text-[56px]">
        채용
      </h2>
      <p className="max-w-[620px] text-[17px] leading-[1.75] text-text-muted">
        현재 공개된 공고는 없습니다. 어크로스의 다음 문제에 함께하고 싶다면
        간단한 한 줄과 함께 연락 주세요.
      </p>
      <div className="mt-8">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium transition-colors hover:bg-bg-elev-1"
        >
          Contact 열기 <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
