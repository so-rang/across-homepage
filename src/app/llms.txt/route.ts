import { COMPANY, SITE_URL } from "@/lib/seo/site";

// llms.txt (https://llmstxt.org): a plain-text brief for AI crawlers and LLM
// page readers. Every statement here is already published on the site — keep
// it that way; this file is not the place for new claims.
export const dynamic = "force-static";

const BODY = `# 어크로스 (Across Inc.)

> ${COMPANY.legalName} — AI 답변 최적화(AEO·GEO)로 당신의 브랜드가 AI의 답에 선택받도록 설계합니다.
> ${COMPANY.tradeName} — Answer & Generative Engine Optimization (AEO·GEO). We design your brand to be chosen inside the answers AI gives.

- 대표: ${COMPANY.ceo} · 사업자등록번호: ${COMPANY.registrationNumber}
- 문의: ${COMPANY.email}
- 언어: 한국어 ${SITE_URL}/ · English ${SITE_URL}/en · 日本語 ${SITE_URL}/ja · 中文 ${SITE_URL}/zh

## 무엇을 하는 회사인가
- 검색의 시대가 답의 시대로 바뀌는 지금, AI(ChatGPT · Claude · Gemini 등)가 브랜드를 어떻게 부르고 선택하는지를 설계합니다.
- 진단: 산업별 목표 질문을 설계하고 10개 AI 모델(글로벌 5 + 중국 5)이 어떻게 답하는지 측정합니다. 자사·경쟁사 언급률과 맥락을 숫자로 꺼냅니다.
- 전략·실행: AI가 학습하는 신뢰도 높은 배포 네트워크(400+ 학습 사이트)에 최적화된 콘텐츠를 배포하고 매주 모니터링합니다.
- 규모: 200+ 고객사, 18개 언어 지원.
- 자체 솔루션: GPTO · GenRank · NAEO.

## 페이지
- [홈](${SITE_URL}/): 회사 소개, 서비스, 콘텐츠, 문의
- [Contents](${SITE_URL}/contents): 언론 보도와 영상
- [개인정보처리방침](${SITE_URL}/privacy)
- [이용약관](${SITE_URL}/terms)
- [Sitemap](${SITE_URL}/sitemap.xml)

## Links
- YouTube: ${COMPANY.sameAs[0]}
- Instagram: ${COMPANY.sameAs[1]}
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
