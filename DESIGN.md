# Across Homepage — DESIGN.md

> 주식회사 어크로스(Across Inc.)의 기업 홈페이지 디자인 단일 소스 문서.
> 대화형 세션(2026-04-23)에서 확정된 결정들을 정리한 것이며, 구현 단계에서 이 문서를 기준으로 한다.

---

## 1. Overview

| 항목 | 값 |
|---|---|
| 회사 | 주식회사 어크로스 (Across Inc.) |
| 대표 서비스 | GPTO (통합), GenRank (AI 답변 비교), NAEO (네이버 AI 진단) |
| 파트너 서비스 | 한경 GPTO, MediGPTO |
| 업의 본질 | GEO / AEO — AI 답변 최적화, 브랜드 선택 설계 |
| 미디어 브랜드 | 어크로스하우스 (YouTube·Instagram 공통) |
| 타깃 | B2B 마케팅·브랜드·PR 의사결정자 |
| 주 과제 | "우와~" 반응 + 경쟁사(예: elifunt.kr) 대비 차별화된 브랜드 체험 |

## 2. 디자인 원칙 / 톤 규칙

1. **디자인이 우주면 충분, 카피는 평범하게.** 카피로 우주 메타포 강요 금지("신호 보내기" 같은 표현 X).
2. **자체 vs 외부 이분법을 일관 적용.** Services(자체 3 / 파트너 2)와 Contents(우리가 쓴 것 / 바깥이 쓴 것)에 동일 원칙.
3. **Mock 데이터 금지.** 빈 자리는 `[항목명]`으로 명시. 확인되지 않은 사실 추측 금지.
4. **위계 명확.** "어크로스가 만든 것" vs "협업·외부" 의 비중 차이를 시각적으로 분리.
5. **가독성 > 장식.** 상세 페이지는 우주 모티프 톤다운, 본문 읽기가 최우선.
6. **WCAG 2.2 AA 이상.** `prefers-reduced-motion` 존중, 키보드 내비 완비.

## 3. Design Tokens

### 3.1 Color

두 테마를 **나란히 정의**한다. 구현은 `src/app/globals.css`의 `@theme`(다크, 기본) 및 `html.light` 블록.

| 토큰 | Dark (기본) | Light | 의미·용도 |
|---|---|---|---|
| `--color-bg` | `#04040a` Deep Space Black | `#ffffff` Pure White | 페이지 배경. `<body>` 바탕. |
| `--color-bg-elev-1` | `rgba(255,255,255,0.035)` Vapor Glass | `#f5f6fa` Mist | 카드 바닥, 입력창 배경. |
| `--color-bg-elev-2` | `rgba(255,255,255,0.06)` Denser Glass | `#eaecf3` Cloud | 카드 hover, 필터 칩 선택, 미니맵 현재 pill. |
| `--color-border-subtle` | `rgba(255,255,255,0.08)` | `rgba(18,25,51,0.10)` | 기본 보더, 구분선. |
| `--color-border-strong` | `rgba(255,255,255,0.28)` | `rgba(18,25,51,0.28)` | 강조 보더, 입력창 hover. |
| `--color-text` | `#f3ecde` Warm Cream | `#121933` Ink Navy | 본문·제목·버튼 주 색. |
| `--color-text-muted` | `rgba(243,236,222,0.55)` | `rgba(18,25,51,0.58)` | 메타, 캡션, 푸터. |
| `--color-signal-blue` | `#7fa3d4` Dusty Blue | `#e63b7a` Horizon Magenta | 링크·포커스·accent. 톤 반전으로 테마 대비. |
| `--color-gpto-blue` | `#5f7dae` Midnight Blue | `#3355a8` Sapphire | GPTO 서비스 컬러. |
| `--color-earth-cyan` | `#9dc5d9` Pale Cyan | `#6ab0d8` Sky Cyan | 보조 악센트. |
| `--color-star-warm` | `#f8efd6` Cream Glow | `#b3894a` Amber Gold | 별 아이콘. 라이트에서는 금색. |

**브랜드 내러티브**: 다크 = 심야 우주(warm cream + dusty blue), 라이트 = 새벽 대기(ink navy + horizon magenta).

### 3.1.1 Across 로고 자산 매핑

**원칙**: 로고 색은 그 모드의 본문 텍스트 색(`--color-text`)과 **정확히 같은 톤**을 쓴다.

| 모드 | 본문 텍스트 | 로고 파일 | 비고 |
|---|---|---|---|
| Dark (기본) | `#f3ecde` Warm Cream | `/logo/across_logo_cream.png` | ✅ 표준 |
| Light | `#121933` Ink Navy | `/logo/across_logo_black.png` | ✅ 표준 |
| — | — | `/logo/across_logo_white.png` | ❌ **사용 금지**. 순흰색은 크림 본문과 어긋나 로고가 튐. |

**적용 대상** (일관): `AcrossMark`(헤더/푸터), `LogoEmblem`(스크린 2), `HomeScroll` 02 섹션 로고, `AcrossSection`(About 첫 블록).

**패턴** (Tailwind v4 dark variant):

```tsx
<Image src="/logo/across_logo_black.png" className="block dark:hidden" ... />
<Image src="/logo/across_logo_cream.png" className="hidden dark:block" ... />
```

### 3.1.2 파트너·서비스 로고 변환 규칙

외부 브랜드 로고는 원작자 의도를 유지. 다음 3종 패턴으로 처리:

| 원본 | 다크 모드 | 라이트 모드 | Tailwind 클래스 |
|---|---|---|---|
| 네이비·컬러 원본 (Primer, MediGround, 고객의눈) | 원본 유지 | 원본 유지 | (없음) |
| 흰 전용 PNG (Hashed, `gpto_logo_white.png`) | 흰색 유지 | 검정으로 반전 | `brightness-0 dark:brightness-100` |
| 네이비 전용 SVG (`hkgpto_hk.svg`) | 흰색으로 반전 | 네이비 유지 | `dark:brightness-0 dark:invert` |

### 3.2 Typography

- **한글 본문**: Pretendard Variable (CJK 가독 확보)
- **영문 헤드**: Space Grotesk
- **숫자·코드**: Space Mono
- 시스템 폰트 폴백: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| 역할 | 크기(데스크톱) | 크기(모바일) | line-height | weight |
|---|---|---|---|---|
| Hero H1 | 72px | 40px | 1.15 / 1.25 | 700 |
| Page H1 | 48px | 32px | 1.2 | 700 |
| Section H2 | 32px | 24px | 1.3 | 600 |
| Card Title | 18px | 17px | 1.4 | 600 |
| Body | 17px | 16px | 1.75 | 400 |
| Meta | 14px | 13px | 1.5 | 400 |

CJK 본문 line-height는 항상 1.75 이상. iOS Safari 입력 요소는 `font-size ≥ 16px`(zoom 방지).

### 3.3 Spacing & Layout

- 8px 그리드 기본. 간격 토큰: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 128.
- 컨테이너 max-width: 1200px(일반), 680px(본문 읽기 모드).
- 브레이크포인트:
  - `sm < 640px` — 모바일 1열
  - `md 640–1023px` — 2열
  - `lg ≥ 1024px` — 3열
- 섹션 세로 padding: 데스크톱 80–128px, 모바일 48–64px.

### 3.4 Motion

| 토큰 | 값 | 용도 |
|---|---|---|
| `--ease-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` | 일반 전환 |
| `--ease-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` | 카드 호버 |
| `--d-micro` | 150ms | 버튼, 포커스 |
| `--d-base` | 300ms | 카드 진입 |
| `--d-zoom` | 800ms | 별자리 줌인/횡이동 |

원칙: transform + opacity만 사용(60fps). duration > 800ms 금지. `prefers-reduced-motion: reduce`에선 150ms 이하로 강제.

## 4. 배경 5레이어

아래에서 위로 쌓이는 순서.

### 4.1 Liquid Ether
- 데스크톱: 마우스 좌표를 따라 느리게 흐르는 유체 셰이더.
- 모바일: 마우스 없음 → 자동 drift(수분마다 방향 반전) 대체.
- `prefers-reduced-motion`: 정적 그라디언트 이미지로 교체.

### 4.2 Dark Veil
- 성운 깊이감. 저주파 노이즈 + 어두운 라디얼 그라디언트.
- 도착 화면 기본 opacity 40%, 블로그 상세 35%.
- Reduced-motion: 정적 SVG 유지.

### 4.3 Antigravity 별 파티클
- 데스크톱 150개, 모바일 60개. `devicePixelRatio` clamp로 저사양 추가 감량.
- 자석 효과: 데스크톱은 마우스 근처로 약하게 빨림, 모바일은 탭 지점에서 튕김.
- **메뉴 별 4개는 자석 효과 OFF**(선택 대상이므로 안정적으로 고정).
- Reduced-motion: 파티클 시스템 완전 비활성, 정적 점 10개 이하로 대체 또는 숨김.

### 4.4 ✦ 별자리 Border Glow
- 별과 별 사이를 잇는 얇은 SVG 선. 별 근처에 soft glow(blur 8px, Signal Blue 12%).
- pulse 0.2Hz 호흡. Reduced-motion에선 정적.

### 4.5 UI
- 모든 상호작용·텍스트 레이어. `backdrop-filter`는 상세 페이지 본문 패널에만 사용(8px blur).

### 저사양·저배터리 폴백

```ts
const lowEnd =
  (navigator.deviceMemory ?? 8) < 4 ||
  (navigator.hardwareConcurrency ?? 8) < 4 ||
  ((await navigator.getBattery?.())?.level ?? 1) < 0.2;

if (lowEnd) {
  // Liquid Ether 정적, Antigravity 30개, Border Glow pulse off
  renderQuality = 'low';
}
```

## 5. 인트로 시퀀스

총 1.8초. 첫 방문에만 풀버전, sessionStorage 플래그가 있으면 0.4s 축약 버전으로 빠르게 완성 상태 전환. LCP 보호를 위해 Hero 카피는 인트로와 독립적으로 첫 페인트부터 DOM에 존재.

| t | 이벤트 |
|---|---|
| 0.2s | Liquid Ether + Dark Veil fade-in |
| 0.4s | Antigravity 파티클 emit 시작 |
| 0.6s | 좌상단 ✦ 어크로스 마크 + 광채 펼침 |
| 0.9s | Hero 카피 3행 stagger (180ms) |
| 1.2s | 별자리 메뉴 별 4개 위→아래 점등 |
| 1.5s | 별-별 연결선 draw |
| 1.8s | 완료. 메뉴 별 interactable |

- Reduced-motion: 즉시 완성 상태(1.8s 시점) 스냅.
- Skip UI 없음(첫 방문). 재방문 0.4s 축약.

## 6. 커스텀 커서

시스템 커서를 대체하지 않고 **보조 악센트**로 동작.

- 커서 모양은 OS 기본(`default` / `pointer` / `text` 등 그대로).
- 커서 주변에 반경 16px, Signal Blue 12% 소프트 글로우 halo.
- 이동 속도가 빠를 때 150ms trail glow(광자 궤적).
- 클릭 시 ✦ sparkle burst(6–8 입자, 300ms fade).
- **모바일**: 커서 없음, 탭 지점에 sparkle burst만.
- **Reduced-motion**: trail·sparkle 비활성, halo도 정적 or 끔.
- 토글은 1차 릴리스에선 기본 ON으로 두고 피드백 후 설정 여부 결정.

## 7. 네비게이션

### 7.1 별자리 네비 (Primary)

Hero 우측에 사선 흐름(우상→우하)으로 ✦ 모양 별 4개 배치:

```
About  ·  Services  ·  Contents  ·  Contact
```

- 각 별: 호버 시 glow 확대 + 라벨 페이드 인.
- 탐색성 보조: 첫 방문에 한해 1.8s 인트로 직후 한 번만 pulse(800ms), 옵션으로 첫 별 근처 tooltip "클릭해서 이동 →" 3초 노출.
- aria-label 각 별에 명시: `"About 섹션으로 이동"` 등.

### 7.2 도착 화면 전환

| 액션 | 지속 | 이징 |
|---|---|---|
| 별 클릭 → 줌인 → 도착 | 0.8s | `--ease-snap` |
| 별 → 별 횡이동 | 0.8s | `--ease-snap` |
| 줌아웃 | 0.6s | `--ease-soft` |

줌아웃 트리거: 외부 영역 클릭 / ESC / 우상단 ✦ 마크 탭 / 모바일 스와이프 다운 / 미니맵 점.

### 7.3 도착 화면 공통

- 배경 5레이어 유지(파티클 opacity 20% 수준으로 살짝 감량).
- 좌상단 ✦ 어크로스 마크는 홈 복귀 버튼.
- 우상단 미니맵: 4개의 작은 점으로 현재 섹션 표시, 클릭으로 이동 가능.

### 7.4 좌측 섹션 인덱스 ✦

About·Services만 사용(다중 섹션). Contents·Contact는 제거(리스트·단일 폼 성격).

- 모바일에서는 **상단 가로 스크롤 탭**으로 변환.

## 8. 페이지별

### 8.1 Hero

**카피 (확정)**:

```
AI가 답하는 세상에서,
당신의 브랜드가
선택받도록
```

- 3행 분할, 좌측 정렬, 전체 `#ffffff`, 마침표 없음. accent 컬러 없음.
- 좌측 카피(60%) + 우측 별자리 네비(40%), 모바일은 카피 위 / 별자리 아래 세로 스택.
- 좌상단 ✦ 어크로스 마크(A 형태 + ✦ 광채 내장). 이 마크는 회사 전체 시각 식별자.

### 8.2 About

오프닝 카피 없음. 도착 시 바로 6개 섹션이 세로 쌓임.

1. **Across** — 회사 소개. 창업 맥락·업의 정의. `[이미지]` 없으면 텍스트 위주 허용.
2. **팀** — 6인. 각 멤버 한 줄 소개. 사진 없으면 이니셜 + ✦ 플레이스홀더.
3. **대표** — 이재홍. 큰 인용문 `"AI는 Decision Layer One이다"` + 짧은 바이오. `[사진]` 슬롯.
4. **투자사** — Primer, 해시드 등(확정 시 로고). 로고 없으면 텍스트 기업명.
5. **파트너·고객사** — 산업 분야 리스트만(케이스 수치 카드 제외). 로고 그리드 + 분야 태그.
6. **채용** — "현재 공개 공고는 없지만 관심 있다면 Contact로 연락 주세요." 한 줄 + Contact 버튼. 빈 공간 금지.

**어크로스 vs 어크로스하우스 관계 명시**: About 페이지 내 적절한 위치에 "어크로스의 미디어 채널 = 어크로스하우스" 한 줄 주석.

### 8.3 Services

자체 3 (크게) + 파트너 2 (작게)의 위계를 시각적으로 분리.

**자체(화면 비중 70%)** — 큰 카드 320×280, 밝은 행성 비주얼 1개씩.
- GPTO (통합 솔루션)
- GenRank (AI 답변 비교)
- NAEO (네이버 AI 진단)

**파트너(화면 비중 15%)** — 구분선 아래, 한 줄 텍스트 + 작은 ◐ 아이콘.
- 한경 GPTO
- MediGPTO (병원 특화)

### 8.4 Contents (구 Insights)

페이지 타이틀 `콘텐츠`, 서브카피 없음. 좌측 ✦ 인덱스 없음.

**필터 칩**: `[전체] [블로그] [영상] [뉴스]`
- 전체 / 포맷별 필터. 모바일은 가로 스크롤 + 스냅.
- 비선택 `--bg-elev-2` + 회색 텍스트, 선택 흰 배경 + 검은 텍스트.

**3열 그리드(데스크톱) / 2열(md) / 1열(sm)**, 카드 높이 통일.

**썸네일 16:9 프레임 공통**:
- `영상`: `object-fit: cover` (유튜브 네이티브 16:9)
- `뉴스`(원본 1:1): `object-fit: contain` + 좌우 여백에 ambient blur(`filter: blur(24px); scale: 1.1; opacity: 0.6`) 확장. **크롭 금지**.
- `블로그`: 자체 제작 16:9 커버 편집 가이드. cover.

**카드 구성**: 썸네일 → ✦ 마크 + 배지(블로그/영상/뉴스) + 매체/채널명 → 제목 2줄 → 요약 2줄 → 날짜(YYYY-MM-DD).

**정렬·페이지네이션**: 최신순, 9개씩 "더 보기" 버튼.

**클릭 동작**:
- `블로그` → 내부 `/contents/posts/[slug]`
- `영상` → 페이지 내 모달(아래 참조)
- `뉴스` → 외부 링크 `target="_blank" rel="noopener noreferrer"`

#### 영상 모달

- Overlay `rgba(6,6,11,0.85)` + `backdrop-filter: blur(12px)`.
- 중앙 16:9 `youtube-nocookie.com` iframe. `playsinline` 필수, 재생 전 muted.
- 하단 메타 + CTA:
  - 자체(어크로스하우스) → `어크로스하우스 구독 ↗`
  - 외부 출연 → `원본 채널에서 보기 ↗`
- ESC / 바깥 클릭 / 우상단 ✕ / 모바일 스와이프 다운으로 닫힘.
- 포커스 트랩 + 닫힐 때 트리거 카드로 포커스 복귀.
- 임베드 비허용 영상(YT `onError`) → 새 창 fallback + `aria-live` 안내.

### 8.5 블로그 상세 `/contents/posts/[slug]`

읽기 모드. 우주 배경 **은은하게 유지**(Dark Veil 35%, 파티클 10%, 속도 50% 감속).

- 좌상단 ✦ 어크로스 마크(홈), 우상단 `← Contents`(섹션 복귀).
- 상단: 제목(Space Grotesk) + 메타(`날짜 · 저자 · 5 min read`).
- 표지 이미지 16:9 (선택).
- 본문: `max-width: 680px`, Pretendard 17–18px, line-height 1.75.
- 본문 패널 배경 `rgba(6,6,11,0.55)` + `backdrop-filter: blur(8px)`로 텍스트 가독성 확보.
- 하단: 저자 한 줄 바이오 + 이전/다음 글 2개.
- Reduced-motion: 배경 정적 이미지.

### 8.6 Contact

폼 단독 중앙 배치. 좌측 ✦ 인덱스 없음. 서브카피 없음.

H1: **문의하기** (영문 보조 `Contact`).

| 필드 | 필수 | 비고 |
|---|---|---|
| 이름 | ✓ | text |
| 회사명 | — | text |
| 이메일 | ✓ | type="email", RFC 5322 |
| 문의 유형 | ✓ | select: 제품 도입 문의 / 파트너십 / 미디어·보도 문의 / 채용 문의 / 기타 |
| 메시지 | ✓ | textarea, 최소 20자 |
| 개인정보 수집 동의 | ✓ | checkbox, 링크 → `/privacy` |

**UI**:
- 라벨 상단 고정(다크 배경에서 floating label 가독성 약함).
- 입력 보더 `rgba(255,255,255,0.15)` → hover 0.3 → focus `--signal-blue` 2px.
- 제출 버튼 `--signal-blue`, disabled 시 opacity 40% + spinner.
- 체크박스 체크 마크는 커스텀 ✦(브랜드 연속성).

**메시지**:
- 성공: `접수되었습니다.`
- 실패: `전송에 문제가 있습니다. ask@gpto.kr로 직접 보내주세요.`
- 응답 시간 약속 멘트 금지("영업일 기준" 등).

**제출 파이프라인**:
- Next.js Route Handler → 메일 릴레이(Resend/SendGrid) → `ask@gpto.kr`.
- 스팸 방지: honeypot(숨김 input) + 제출 시간 ≥ 5s 체크. 필요 시 reCAPTCHA v3 추가.
- 중복 제출 방지(버튼 disabled).

**접근성**:
- 모든 필드 `aria-label` 또는 `<label for>`.
- 에러 `aria-live="polite"`, 필드별 `aria-describedby`.
- 포커스 링 Signal Blue 3px.

서울 오피스 **비공개**. 어디에도 노출하지 않음.

### 8.7 Footer

별자리 도착 화면 **4개엔 푸터 없음**(풀스크린 몰입). 상세·정적 페이지(`/contents/posts/[slug]`, `/privacy`, `/terms`)에만 노출.

```
──────────────────────────────────────────────────
  ✦ Across          About · Services · Contents · Contact

  주식회사 어크로스 (Across Inc.)         이용약관
  대표이사 이재홍                         개인정보처리방침
  사업자등록번호 288-86-03687
  ask@gpto.kr                             [▷] [◯]

                                      © 2026 Across Inc.
──────────────────────────────────────────────────
```

- **주소 생략**(홈페이지 푸터 전략). 본점 정식 주소는 `/privacy`에만 법적 표기.
- 소셜 아이콘:
  - `[▷] YouTube` → https://www.youtube.com/@acrosshouse (aria-label: `YouTube 어크로스하우스`)
  - `[◯] Instagram` → https://www.instagram.com/across.house (aria-label: `Instagram @across.house`)
  - 둘 다 `target="_blank" rel="noopener noreferrer"`.
- 텍스트 `--text-muted`, 호버 시 `--text`. 포커스 링 Signal Blue 2px.
- 상단 경계선 `border-top: 1px solid var(--border)`.
- 모바일: 단일 column, 소셜 아이콘은 네비 링크 하단.

## 9. 라우팅 구조

```
/                            # Hero + 별자리 네비
/about                       # 도착 화면 (풀스크린)
/services                    # 도착 화면 (풀스크린)
/contents                    # 도착 화면 (필터 + 3열 그리드)
/contents/posts/[slug]       # 블로그 상세 (내부, 우주 은은 유지)
/contents/ours               # 자체 전체 아카이브 (옵션, 콘텐츠 축적 후)
/contents/elsewhere          # 외부 전체 아카이브 (옵션)
/contact                     # 도착 화면 (폼 단독)
/privacy                     # 개인정보처리방침 (본점 주소 정식 표기)
/terms                       # 이용약관
```

## 10. 반응형 매트릭스

| 영역 | < 640px | 640–1023px | ≥ 1024px |
|---|---|---|---|
| Hero 레이아웃 | 카피 위 / 별자리 아래 | 2열 | 좌 60 / 우 40 |
| 메뉴 별 4개 | 2×2 그리드 | 사선 배치 | 사선 배치 |
| Services 카드 | 1열 세로 | 2열 | 자체 3열 + 파트너 구분선 |
| Contents 그리드 | 1열 | 2열 | 3열 |
| Contact 폼 | 풀폭 - 32px | 480px max | 480px max |
| Footer | 단일 column | 2 column | 3 블록 row |
| 좌측 ✦ 인덱스(About) | 상단 가로 스크롤 탭 | 좌측 고정 | 좌측 고정 |
| 영상 모달 | full-screen bottom sheet | 중앙 다이얼로그 | 중앙 다이얼로그 |

추가 주의:
- iOS Safari `100vh` 버그 → `100dvh`.
- 탭 타깃 최소 44×44px(WCAG 2.2).
- 호버-only 인터랙션 금지. 모든 액션은 첫 탭에서 실행.
- Contents 필터 칩 가로 스크롤은 `scroll-snap-type: x mandatory`.

## 11. 접근성

### 11.1 `prefers-reduced-motion: reduce`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .particles-layer,
  .liquid-ether { display: none; }
}
```

- 인트로 1.8s → 즉시 완성 상태.
- 줌 0.8s → 크로스페이드 150ms 또는 즉시 교체.
- 커스텀 커서 trail·sparkle OFF.
- Border Glow pulse OFF.

### 11.2 키보드

- 모든 상호작용 요소 탭 가능. 탭 순서 DOM 자연 순서와 일치.
- 포커스 링 `outline: 2px solid var(--signal-blue); outline-offset: 2px`.
- 별자리 메뉴 별은 `button` 또는 `a` 시맨틱 요소. `aria-label` 명시.
- 모달: 포커스 트랩, ESC 닫힘, 닫힐 때 트리거로 복귀.

### 11.3 색 대비

- 본문 흰색 / `#06060b` 배경 대비 ≥ 18:1 (AAA).
- `--text-muted` / 배경 대비 ≥ 4.5:1 (AA).
- Signal Blue / 배경 대비 확인 후 사용(링크 시).

## 12. 성능 예산

| 지표 | 목표 |
|---|---|
| LCP | < 2.5s (3G Slow 기준) |
| CLS | < 0.1 |
| INP | < 200ms |
| 초기 JS (gzip) | < 200KB |
| 파티클 60fps(데스크톱) / 30fps(모바일 throttle 4×) 유지 | ✓ |
| 이미지 | `sizes` + `loading="lazy"`(첫 화면 제외) |
| 유튜브 iframe | 모달 열릴 때 lazy 삽입. 카드 썸네일은 이미지만. |

Hero 카피는 인트로 이전에 첫 페인트로 렌더(LCP 보호).

## 13. 구현 스택 권장

- **Framework**: Next.js (App Router) + TypeScript.
- **Styling**: Tailwind CSS + CSS variables(위 디자인 토큰을 `:root`에 정의).
- **Components**: shadcn/ui 기반. 모션 악센트는 motion/react 또는 GSAP.
- **3D / Shader**: ogl 또는 React Three Fiber (Liquid Ether, Antigravity).
- **Mail**: Next.js Route Handler + Resend.
- **Analytics**: Plausible 또는 Umami(쿠키리스, 개인정보 처리방침 부담 최소).
- **Hosting**: Vercel 권장(Edge + Image Optimization).
- **Font**: Pretendard Variable(self-host 권장, subset), Space Grotesk / Space Mono(Google Fonts 또는 self-host).

## 14. 외부 링크 참조 카탈로그

| 항목 | URL / 값 |
|---|---|
| 회사 도메인 | gpto.kr |
| 대표 | 이재홍 |
| 사업자등록번호 | 288-86-03687 |
| 이메일 | ask@gpto.kr |
| YouTube | https://www.youtube.com/@acrosshouse |
| Instagram | https://www.instagram.com/across.house |
| 법적 본점 주소(정식) | `/privacy`에서만 표기 (충청남도 천안시 서북구 쌍용1길 27, 5층 — 최종 표기는 juso.go.kr 확정 후) |
| 서울 오피스 | 비공개 |

## 15. Open Items (구현 시 확정)

- [ ] 투자사 로고(Primer, 해시드 등) 정식 에셋 수급.
- [ ] 대표·팀 멤버 프로필 사진(고해상 + 편집본).
- [ ] 서비스별 행성 비주얼 3종(GPTO / GenRank / NAEO) 최종 렌더.
- [ ] 파트너사(한경 GPTO, MediGPTO) 아이콘 ◐ 디자인.
- [ ] 본점 정식 도로명 주소 juso.go.kr에서 최종 확인 후 `/privacy`에 기재.
- [ ] 블로그 첫 글(예: "AI Decision Layer One") 작성.
- [ ] 온보딩 힌트 tooltip 노출 정책(세션 플래그) 세부 튜닝.
- [ ] 커스텀 커서 토글 필요 여부 — 릴리스 후 피드백 확인.

## Changelog

- **2026-04-23**: 초판. Hero 카피 / About 오프닝 삭제 / Contents(구 Insights → Contents) / 모바일·reduced-motion 매트릭스 포함.
