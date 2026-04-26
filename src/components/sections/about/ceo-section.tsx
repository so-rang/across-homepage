import Image from "next/image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function CeoSection() {
  return (
    <section id="ceo" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <h2 className="mb-8 text-[32px] font-medium leading-[1.4] tracking-[0.01em] text-text sm:text-[44px] sm:leading-[1.3] lg:text-[56px]">
          대표
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[280px_1fr]">
        <ScrollReveal axis="x" distance={24}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border-subtle bg-bg-elev-1">
            <Image
              src="/profile/01 - 0325.jpg"
              alt="주식회사 어크로스 대표 이재홍"
              fill
              sizes="(min-width: 768px) 280px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>
        <ScrollReveal distance={20} delay={0.15}>
          <blockquote className="font-serif text-[28px] font-medium italic leading-[1.4] tracking-[0.01em] text-text sm:text-[36px]">
            <span aria-hidden className="mr-2 text-text-muted">“</span>
            AI는 Decision Layer One이다.
            <span aria-hidden className="ml-2 text-text-muted">”</span>
          </blockquote>
          <p className="mt-8 text-lg font-medium tracking-[0.01em]">이재홍</p>
          <p className="mt-1 text-sm text-text-muted">
            주식회사 어크로스 Founder &amp; CEO · GPTO 기술의 창시자
          </p>
          <div className="mt-6 max-w-[580px] space-y-6 text-[17px] leading-[1.75] text-text-muted">
            <p>
              KAIST 산업공학을 졸업하고 제일기획에서 Data Scientist·AE로 3년,
              <br />
              이후 스타트업에서 기획·마케팅을 6년간 담당했습니다.
              <br />
              기획에서 개발까지 직접 구현하는 풀스택 오퍼레이터입니다.
            </p>
            <ul className="space-y-1 text-[15px] leading-[1.65]">
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-text-muted"
                />
                <span>
                  <cite className="not-italic text-text">
                    『AEO·GEO 생존전략』
                  </cite>{" "}
                  저자 · 경제경영 베스트셀러 5위
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-text-muted"
                />
                <span>프라이머 27기 데모데이 발표</span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-text-muted"
                />
                <span>교보문고 본사 컨퍼런스 연사</span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-text-muted"
                />
                <span>국내외 주요 VC·기업 대상 GEO 세미나·컨설팅</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
