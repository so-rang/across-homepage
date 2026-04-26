import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-04-23";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-20 sm:px-10">
      <header className="mb-10">
        <h1 className="font-display text-[32px] font-light leading-[1.3] tracking-[0.01em] sm:text-[44px]">
          이용약관
        </h1>
        <p className="mt-3 font-mono text-sm text-text-muted">
          최종 수정일 {LAST_UPDATED}
        </p>
      </header>

      <div className="prose-across">
        <h2>1. 목적</h2>
        <p>
          본 약관은 주식회사 어크로스(이하 &quot;회사&quot;)가 운영하는
          홈페이지에서 제공하는 정보 및 문의 채널의 이용 조건을 정합니다.
        </p>

        <h2>2. 서비스의 제공</h2>
        <p>
          회사는 홈페이지를 통해 회사 소개, 제품·서비스 안내, 콘텐츠,
          문의 접수 기능을 제공합니다. 서비스 내용은 예고 없이 변경될 수
          있습니다.
        </p>

        <h2>3. 이용자의 의무</h2>
        <ul>
          <li>관련 법령 및 본 약관의 규정을 준수해야 합니다.</li>
          <li>타인의 권리를 침해하거나 업무에 지장을 주는 행위를 하지 않습니다.</li>
          <li>허위 정보나 타인의 정보를 도용하지 않습니다.</li>
        </ul>

        <h2>4. 지적재산권</h2>
        <p>
          홈페이지에 게시된 모든 콘텐츠(텍스트·이미지·영상·로고 등)의
          저작권은 회사 또는 정당한 권리자에게 있으며, 사전 서면 동의 없이
          복제·전송·배포할 수 없습니다.
        </p>

        <h2>5. 면책 조항</h2>
        <p>
          회사는 천재지변, 회선 장애 등 불가항력으로 인한 서비스 중단에
          대해 책임을 지지 않습니다. 외부 링크가 가리키는 제3자 서비스의
          정확성·합법성에 대해서도 책임을 지지 않습니다.
        </p>

        <h2>6. 준거법 및 관할</h2>
        <p>
          본 약관은 대한민국 법령에 따라 해석되며, 분쟁 발생 시 민사소송법상
          관할 법원을 제1심 관할 법원으로 합니다.
        </p>

        <h2>7. 개정</h2>
        <p>
          본 약관은 {LAST_UPDATED}부터 시행합니다. 개정 시 홈페이지에 공지합니다.
        </p>
      </div>
    </article>
  );
}
