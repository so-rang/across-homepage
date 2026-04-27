# Admin Page Handoff

## 즉시 막힌 이슈 — `redirect_uri_mismatch`

Google OAuth 동의 화면에서 400 발생 중. 원인은 GCP에 등록한 **승인된 리디렉션 URI**가 Supabase가 실제로 보내는 redirect_uri와 다름.

### 해결: GCP 콘솔에서 redirect URI 정확히 등록

[Google Cloud Console → API 및 서비스 → 사용자 인증 정보](https://console.cloud.google.com/apis/credentials) → 만든 OAuth 2.0 클라이언트 ID 클릭 → **승인된 리디렉션 URI**에 아래 한 줄을 정확히 추가 (오타·trailing slash 주의):

```
https://mwcmktebidqwbpxjyzrd.supabase.co/auth/v1/callback
```

> ⚠️ 자주 하는 실수
> - `http://localhost:3000/admin/auth/callback`을 GCP에 넣음 → **틀림**. GCP에는 Supabase callback만 등록. localhost는 Supabase 대시보드 Site URL/Redirect URLs에만.
> - 끝에 `/` 추가 → 틀림.
> - `https`가 아닌 `http` → 틀림.

저장 후 5~10초 정도 propagation 대기.

### 확인용 체크리스트

- [ ] GCP `승인된 리디렉션 URI`: `https://mwcmktebidqwbpxjyzrd.supabase.co/auth/v1/callback`
- [ ] GCP `승인된 자바스크립트 원본`: `https://mwcmktebidqwbpxjyzrd.supabase.co`, `http://localhost:3000`
- [ ] Supabase Dashboard → Auth → Providers → Google: Client ID/Secret 입력 + ON
- [ ] Supabase Dashboard → Auth → URL Configuration:
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/**`

---

## 현재 상태

### ✅ 완료된 것

1. **DB 스키마**
   - `public.profiles` (id, email, display_name, avatar_url, role, created_at, updated_at)
     - `role` ∈ `'admin' | 'staff' | null`
   - `public.posts` (id, slug, title, excerpt, content JSONB, cover_image, cover_alt, category, read_time, status, author_id, author_name, author_bio, published_at, ...)
     - `status` ∈ `'draft' | 'published'`
   - 트리거:
     - `set_updated_at` (자동 updated_at)
     - `handle_new_user` (auth.users insert → profiles 자동 생성, `@across.center` 도메인이면 `role='staff'` 자동)
   - 헬퍼 함수: `public.current_user_role()` (RLS 무한재귀 방지용 SECURITY DEFINER)
   - RLS:
     - posts: 누구나 published read / staff·admin read all·insert·update / admin delete
     - profiles: 본인 read·update / staff·admin read all / admin update all
   - GRANT: anon SELECT (posts/profiles), authenticated full

2. **Supabase 클라이언트**
   - `src/lib/supabase/client.ts` — 브라우저
   - `src/lib/supabase/server.ts` — 서버 컴포넌트(쿠키 기반)
   - `src/lib/supabase/anon.ts` — 빌드/SSG용 cookieless anon
   - `src/lib/supabase/proxy.ts` — proxy.ts에서 세션 갱신용

3. **Proxy 게이팅**
   - `src/proxy.ts` — `/admin/*`은 user 없으면 `/admin/login`으로 redirect, 다른 경로는 next-intl 라우팅

4. **Admin UI**
   - `src/app/admin/layout.tsx` — html/body/폰트/Toaster (별도 root layout)
   - `src/app/admin/(public)/login/page.tsx` — Google 로그인 버튼
   - `src/app/admin/(public)/forbidden/page.tsx` — 권한 없을 때
   - `src/app/admin/(public)/auth/callback/route.ts` — OAuth 콜백 (code → session)
   - `src/app/admin/(protected)/layout.tsx` — role 체크 + nav + 로그아웃
   - `src/app/admin/(protected)/page.tsx` — `/admin/posts`로 redirect
   - `src/app/admin/(protected)/posts/page.tsx` — 목록
   - `src/app/admin/(protected)/posts/new/page.tsx` — 새 글
   - `src/app/admin/(protected)/posts/[id]/page.tsx` — 편집/삭제

5. **Admin 로직**
   - `src/features/admin/types/post.ts` — PostRow / ProfileRow
   - `src/features/admin/utils/auth.ts` — `getCurrentProfile`, `requireStaffProfile`
   - `src/features/admin/actions/auth.ts` — `signInWithGoogleAction`, `signOutAction`
   - `src/features/admin/actions/posts.ts` — create / update / delete (zod 검증, revalidatePath)
   - `src/features/admin/components/post-editor.tsx` — TipTap 에디터 (StarterKit + Link + Image + Placeholder)
   - `src/features/admin/components/post-form.tsx` — PostForm (작성/편집 공용)

6. **블로그 DB 연동**
   - `src/lib/content/index.ts` — `getAllContents`, `getBlogPost`, `getAllBlogSlugs` 모두 async + DB 조회 (anon client)
   - `src/app/[locale]/(article)/contents/posts/[slug]/page.tsx` — TipTap JSON → HTML(`@tiptap/html` `generateHTML`) 서버 렌더 + `force-dynamic`
   - `src/app/[locale]/(marketing)/contents/page.tsx` — await 추가 + `force-dynamic`
   - `src/components/sections/home-contents-preview.tsx`, `home-contents-slider.tsx` — async 컴포넌트로 변환

7. **sample.mdx → DB**
   - markdown 본문을 TipTap JSON으로 수동 변환해 SQL INSERT
   - `src/content/posts/sample.mdx` 파일은 더 이상 사용 안 됨 (지우거나 백업 그대로 둠)

8. **타입체크**: `pnpm typecheck` 통과
9. **스모크 테스트**:
   - `GET /` 200
   - `GET /contents` 200
   - `GET /contents/posts/sample` 200 (제목 정상)
   - `GET /admin/login` 200
   - `GET /admin/posts` 307 → `/admin/login?next=...` (게이팅 동작)

### 📦 설치한 패키지

```
@tiptap/react @tiptap/pm @tiptap/starter-kit
@tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image
@tiptap/html
```

### 🗺 환경변수 (`.env.local` 이미 세팅됨)

```
NEXT_PUBLIC_SUPABASE_URL=https://mwcmktebidqwbpxjyzrd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

> Google Client ID/Secret은 Supabase 대시보드에만 들어가면 됨. 앱 `.env.local`에 안 넣음.

---

## 다음 세션에서 할 일

### 1. (블로커) GCP redirect URI 수정 후 OAuth 동작 확인

- GCP에 위 redirect URI 등록
- `http://localhost:3000/admin/login` → "Google로 계속하기" → 본인 `@across.center` 계정 선택 → `/admin/posts`로 리다이렉트되는지
- 만약 로그인은 되는데 `/admin/forbidden`으로 가면: DB의 `profiles` row에서 `role`이 NULL일 가능성
  - SQL로 확인: `select id, email, role from public.profiles;`
  - 본인 row의 role이 NULL이면 트리거가 도메인 체크 못 한 거 → 직접 `update public.profiles set role='admin' where email='sorang@across.center';` 로 본인을 admin으로 승격

### 2. 동작 확인 체크리스트

- [ ] 로그인 → `/admin/posts` 진입
- [ ] "새 글 작성" → 제목/slug/카테고리/본문 입력 → 저장
- [ ] 목록에서 새 글 보임
- [ ] 편집 페이지에서 수정 → 저장 → toast 뜸
- [ ] `status: published` + 발행 → `http://localhost:3000/contents/posts/{slug}` 에서 일반 사용자 화면으로 보임
- [ ] 삭제 → 목록과 contents 페이지에서 사라짐

### 3. 알려진 잔여 이슈/개선 후보

- **에디터 UX**: 현재 link/image는 prompt() 사용 — 다이얼로그로 바꾸면 더 깔끔. 우선순위 낮음
- **이미지 업로드**: 현재는 URL만 받음. Supabase Storage 직결 업로더는 미구현. 필요해지면 그때
- **자동저장**: 미구현. 글이 길어지면 추가 고려
- **권한 회수**: `/admin/users` 화면 미구현. 퇴사자 대응 필요해지면 추가 (지금은 SQL로 `update profiles set role=null where email='...'`)
- **카테고리 자유입력**: 지금은 자유 텍스트. 향후 enum으로 제약 가능
- **slug 중복**: DB unique 제약 있음. UI에서 친절한 에러 메시지로 잡으면 더 좋음 (현재는 generic error message)

### 4. 운영 시 참고

- **새 글 발행 즉시 반영됨** (force-dynamic + revalidatePath)
- **빌드 시점 DB 호출**: `getAllBlogSlugs` (sitemap에서 호출). 빌드 환경에 SUPABASE_URL/ANON_KEY 필요
- **`@across.center` 도메인 자동 staff**: 트리거에서 split_part로 도메인 비교
- **마이그레이션 이력 (Supabase)**:
  1. `init_admin_schema`
  2. `add_author_fields_to_posts`
  3. `fix_rls_recursion`
  4. `grant_table_privileges`

---

## 빠른 시작 (다음 세션)

```bash
cd /Users/sorang/Desktop/across_homepage/across_homepage
pnpm dev
# → http://localhost:3000/admin/login
```

GCP redirect URI 수정 → 로그인 테스트 → 잘 되면 운영 시작. 막히면 위 "확인용 체크리스트" 다시 점검.
