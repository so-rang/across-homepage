import Image from "next/image";
import Link from "next/link";

export function AcrossSection() {
  return (
    <section
      id="across"
      className="flex min-h-[100svh] scroll-mt-24 flex-col justify-center py-24 sm:py-32"
    >
      <Link
        href="/"
        aria-label="어크로스 홈으로"
        className="mb-10 inline-block self-center transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <Image
          src="/logo/across_logo_cream.png"
          alt="어크로스 로고"
          width={589}
          height={758}
          priority
          className="block h-20 w-auto opacity-90 brightness-0 dark:brightness-100 sm:h-24 lg:h-28"
        />
      </Link>
      <h2 className="mb-8 text-[32px] font-medium leading-[1.4] tracking-[0.01em] text-text sm:text-[44px] sm:leading-[1.3] lg:text-[56px]">
        어크로스는 AI 답변 최적화 GEO·AEO 회사입니다
      </h2>
      <div className="space-y-6 text-[17px] leading-[1.75] text-text-muted">
        <p className="max-w-[680px]">
          ChatGPT·Claude·Gemini가 답을 내놓는 순간, 당신의 브랜드가 먼저
          인용되도록 만듭니다.
        </p>
        <p className="whitespace-normal lg:whitespace-nowrap">
          자체 프로덕트로 먼저 검증하고, 같은 기술을 파트너 프로덕트에
          공급합니다. 입증된 방법만 드립니다.
        </p>
      </div>
    </section>
  );
}
