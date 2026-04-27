# Admin 페이지 구축 (블로그 운영용)

## 결정사항

- **저장소**: Supabase (Postgres + Storage + Auth)
- **인증**: 이메일 매직링크 — 직원 이메일 도메인(`@across.center`) allowlist
- **에디터**: TipTap 기반 WYSIWYG (비개발자 친화)
- **이미지**: Supabase Storage 드래그앤드롭 업로드
- **접근 경로**: `/admin` (로그인 안 된 사용자는 `/admin/login` 으로 리다이렉트)

## Supabase 프로젝트 세팅값

- Project name: `across-homepage`
- Region: Asia-Pacific → Seoul (ap-northeast-2)
- DB password: 1Password 등 비번 매니저에 저장 필수
- Enable Data API: ✅
- Automatically expose new tables: ❌ (RLS 직접 통제)
- Enable automatic RLS: ✅

## 작업 단계

### 1. Supabase 연결 + env 세팅
- [ ] `@supabase/supabase-js`, `@supabase/ssr` 설치
- [ ] `.env.local` 에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
- [ ] `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts` 생성

### 2. DB 스키마 + RLS
- [ ] `posts` 테이블 — id, slug, title, summary, cover_url, content (jsonb 또는 markdown), status (draft/published), author_id, published_at, created_at, updated_at
- [ ] `post_images` 테이블 (옵션) — 이미지 메타
- [ ] RLS 정책:
  - SELECT: 누구나 (status='published'만), 인증된 사용자는 전부
  - INSERT/UPDATE/DELETE: `@across.center` 이메일 가진 사용자만
- [ ] Storage 버킷 `post-images` 생성 + 정책

### 3. Auth UI
- [ ] `/admin/login` 페이지 — 이메일 입력 → 매직링크 발송
- [ ] `/auth/callback` 핸들러 — 콜백 처리 후 `/admin` 으로
- [ ] 미들웨어/proxy.ts에서 `/admin/*` 보호
- [ ] 도메인 allowlist 검증 (서버사이드)

### 4. 글 관리 UI (`/admin`)
- [ ] 글 목록 (status별 필터, 검색)
- [ ] 글 작성/편집 (`/admin/posts/new`, `/admin/posts/[id]/edit`)
- [ ] TipTap 에디터 통합 — 헤딩/리스트/링크/이미지/코드/인용 등
- [ ] 메타 입력 (title, slug 자동/수동, summary, cover, status)
- [ ] 임시저장 / 발행 토글
- [ ] 미리보기

### 5. 이미지 업로드
- [ ] 에디터 내 이미지 드래그앤드롭 → Supabase Storage 업로드 → URL 반환
- [ ] 이미지 압축/리사이즈 (옵션)
- [ ] 커버 이미지 업로드

### 6. 공개 페이지 연동
- [ ] 기존 `src/content/posts/*.mdx` 흐름을 Supabase 조회로 교체
- [ ] `/contents` 목록 페이지 — published만 표시
- [ ] `/contents/posts/[slug]` 상세 페이지 — Supabase에서 조회
- [ ] ISR (`revalidate: 60`) 또는 on-demand revalidation 으로 캐시
- [ ] OG 이미지/메타 자동 생성

## 열린 질문

- 기존 `src/content/posts/sample.mdx` 어떻게? (마이그레이션 vs 무시)
- 직원 이메일 도메인이 정말 `@across.center` 만? 다른 도메인 있으면?
- 댓글 기능 필요? (지금은 X 가정)
- 다국어(i18n) 글 지원? — 한 글에 여러 언어 vs 언어별 글 분리

## 참고

- Supabase Next.js 가이드: https://supabase.com/docs/guides/auth/server-side/nextjs
- TipTap shadcn 템플릿: https://tiptap-shadcn-template.vercel.app/
- RLS 패턴: https://supabase.com/docs/guides/auth/row-level-security
