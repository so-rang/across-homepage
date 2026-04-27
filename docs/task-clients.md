# Customer Logos Section — Task

Add a "Clients (고객사)" block of customer logos to two places:

1. **Home (`/`)** — inside the "함께 기준을 세우는 사람들" section (Screen 5 of `HomeScroll`, anchor `#home-partners`).
2. **About (`/about`)** — inside `PartnersClientsSection` (anchor `#partners`).

Both should render the same set of customer logos consistently, alongside the existing `Backed by` (investors) and `Partners` blocks.

## Asset Source

57 new customer logos already in `public/logo/`:

```
public/logo/
├── logo_origin/   ← raw originals (do not edit, kept for reproducibility)
└── logo_<name>.{png|webp|avif|svg|ico}   ← background-removed versions
```

To list them:

```bash
ls public/logo/logo_origin/
```

Background removal is already done via `scripts/cutout-all-logos.mjs` (auto-detects bg color, applies unpremultiply). One-off `scripts/cutout-elice.mjs` uses flood-fill to preserve interior white. Both safe to re-run.

**Excluded from "clients"** (these are brand/owned-products/partners/investors, not clients):
- `genrank_rock.png`
- `logo_across_*` (3)
- `logo_genrank*` (2)
- `logo_naeo*` (2)
- `logo_gpto_white`
- `logo_hashed`, `logo_primer` (investors)
- `logo_hkgpto_hk`, `logo_medi_trans`, `logo_client_eye` (partners)

The 57 client logos = everything currently inside `public/logo/logo_origin/`.

## Files to Touch

### Shared data (recommended first step)

Centralize the client list to avoid duplication between Home and About:

- **New** `src/lib/clients.ts` — exports `CLIENTS: readonly Client[]` analogous to `src/lib/partners.ts` and `src/lib/owned-products.ts`.
- Each entry: `{ id, name, src, width, height, invertOnDark? }`.
- Read each file's natural dimensions via `sharp().metadata()` or `sips -g pixelWidth -g pixelHeight`.

### Home page

- `src/components/sections/home-partners-strip.tsx` — currently has `INVESTORS` + `PARTNERS`. Add a third `Clients` block. Either inline another `<ul>` or extract a separate `<HomeClientsStrip />` component if it gets long.
- `src/components/sections/home-scroll.tsx:155-178` — the `home-partners` `<section>`. May need to slot in the clients block here.

### About page

- `src/components/sections/about/partners-clients-section.tsx` — already has `INVESTORS` + `PARTNERS`. Add a `Clients` block below `Partners`.
- `src/app/[locale]/(marketing)/about/page.tsx` — verify section is mounted (already imports `PartnersClientsSection`, no change expected).

### i18n

- `src/messages/{ko,en,ja,zh}.json` — add a `clients` block under both `home.partnersStrip` and `about.partnersClients`. Minimum: `eyebrow` ("Clients" or "고객사"), optionally `lead`. Per-item names usually English brand names so likely no localization per item.

## Reference Pattern

Existing investors block in `src/components/sections/home-partners-strip.tsx`:

```tsx
<ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
  {INVESTORS.map((inv) => (
    <li key={inv.name} className="h-7 sm:h-8">
      <Image
        src={inv.src}
        alt={inv.name}
        width={inv.width}
        height={inv.height}
        className="h-full w-auto opacity-80 brightness-0 transition-opacity hover:opacity-100 dark:invert"
        sizes="(min-width: 640px) 160px, 120px"
      />
    </li>
  ))}
</ul>
```

The clients block should mirror this but accommodate ~57 logos. Recommended layout:

- Multi-row `flex flex-wrap` with `gap-x-8 gap-y-6` (or responsive grid `grid-cols-3 sm:grid-cols-5 lg:grid-cols-7`)
- Smaller per-logo height (`h-6 sm:h-7`) so the wall reads as one band
- `opacity-70 hover:opacity-100` for muted "wall" effect
- Mobile: consider lazy loading and limiting initial render

## Open Decisions

1. **Sort order** — alphabetical, by category, or curated highlight order? Recommend alphabetical for first pass.
2. **Label** — "Clients" (English) or "고객사"? Existing labels use English (`Backed by`, `Partners`) so probably "Clients".
3. **Per-logo metadata** — do clients need `field` (industry) / `href` (website)? Or just logo + name? Investors only have name + logo; clients can match.
4. **Mobile density** — show all 57 on mobile, or limit to ~24 + "more" link? Mobile loading is already a concern (12MB earth.mp4 + many logos).
5. **Color treatment** — `dark:invert` like investors (renders as flat ink, ignores logo color), or keep original colors (since cutouts preserve color)? Pick one consistent rule for the clients block.

## Acceptance Criteria

- [ ] `src/lib/clients.ts` created with all 57 client entries (id, name, src, width, height)
- [ ] Home `/` (Korean): "함께 기준을 세우는 사람들" section shows Clients block alongside Backed by + Partners
- [ ] About `/about` (Korean): same Clients block visible inside `#partners` anchor
- [ ] All 4 locales (ko/en/ja/zh) have any new i18n keys
- [ ] No `404` on logo `src` paths (verify in dev server)
- [ ] Mobile: layout doesn't reflow noticeably; images use `next/image` with `sizes`
- [ ] Dark + light themes both readable
- [ ] `pnpm typecheck` (or `npx tsc --noEmit`) clean
- [ ] No regression in existing Backed by + Partners blocks

## Resume Notes

- This file is separate from the existing `task.md` (which covers admin/Supabase work). Don't conflate them.
- Untracked artifacts in working tree as of session end:
  - `public/logo/logo_origin/` — 57 raw client logos
  - `public/logo/logo_*` — background-removed versions
  - `scripts/cutout-all-logos.mjs`, `scripts/cutout-elice.mjs`
- Recent header polish work was already committed (`bb3edcd chore(content): refresh generated content snapshot` and earlier).
- Existing related files for reference:
  - `src/lib/partners.ts` — partner data shape (3 entries)
  - `src/lib/owned-products.ts` — product data shape (3 entries)
  - `src/components/sections/home-partners-strip.tsx` — home partner strip (Investors + Partners)
  - `src/components/sections/about/partners-clients-section.tsx` — about partner section (Investors + Partners)
  - `src/messages/ko.json:67-153` — `home.partners*` i18n
  - `src/messages/ko.json:264-283` — `about.partnersClients` i18n
