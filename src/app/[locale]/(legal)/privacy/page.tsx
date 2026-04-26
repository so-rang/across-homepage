import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-04-23";
const OFFICE_ADDRESS =
  "[B05 — 본점 도로명 주소 (juso.go.kr 확정 후 반영)]";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-[760px] px-6 py-20 sm:px-10">
      <header className="mb-10">
        <h1 className="font-display text-[32px] font-light leading-[1.3] tracking-[0.01em] sm:text-[44px]">
          개인정보처리방침
        </h1>
        <p className="mt-3 font-mono text-sm text-text-muted">
          최종 수정일 {LAST_UPDATED}
        </p>
      </header>

      <div className="prose-across">
        <p>
          주식회사 어크로스(이하 &quot;회사&quot;)는 개인정보 보호법 및 관련
          법령을 준수하여 이용자의 개인정보를 보호합니다. 본 방침은 회사의
          홈페이지 및 문의 채널에 적용됩니다.
        </p>

        <h2>1. 수집하는 개인정보 항목</h2>
        <ul>
          <li>필수: 이름, 이메일, 문의 유형, 메시지</li>
          <li>선택: 회사명</li>
          <li>자동 수집: 접속 IP, User-Agent, 접속 시각</li>
        </ul>

        <h2>2. 수집 및 이용 목적</h2>
        <ul>
          <li>문의 사항에 대한 답변 및 대응</li>
          <li>서비스 품질 개선을 위한 통계 분석</li>
        </ul>

        <h2>3. 보유 기간</h2>
        <p>
          수집된 개인정보는 문의 대응 완료 후 <strong>1년간</strong>
          보관하며, 이후 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이
          필요한 경우에는 해당 기간 동안 보관합니다.
        </p>

        <h2>4. 제3자 제공</h2>
        <p>회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>

        <h2>5. 처리 위탁</h2>
        <ul>
          <li>
            <strong>Resend, Inc.</strong> — 문의 메일 전송. 위탁 항목: 이름,
            이메일, 메시지 내용.
          </li>
        </ul>

        <h2>6. 이용자의 권리</h2>
        <p>
          이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를
          요구할 수 있으며, 요청 시 지체 없이 처리합니다. 요청은
          <a href="mailto:ask@across.center"> ask@across.center</a>로 보내주세요.
        </p>

        <h2>7. 안전성 확보 조치</h2>
        <p>
          전송 구간 암호화(HTTPS/TLS), 접근 통제, 저장소 최소화 원칙을
          적용합니다.
        </p>

        <h2>8. 회사 정보</h2>
        <ul>
          <li>상호: 주식회사 어크로스 (Across Inc.)</li>
          <li>대표이사: 이재홍</li>
          <li>사업자등록번호: 288-86-03687</li>
          <li>본점 주소: {OFFICE_ADDRESS}</li>
          <li>
            이메일: <a href="mailto:ask@across.center">ask@across.center</a>
          </li>
        </ul>

        <h2>9. 개정 이력</h2>
        <p>본 방침은 {LAST_UPDATED}부터 시행합니다.</p>
      </div>
    </article>
  );
}
