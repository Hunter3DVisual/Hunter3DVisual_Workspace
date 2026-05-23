# Hunter3DVisual — Cloud Migration & Production Roadmap
> Generated: 2026-05-23 | Architect: Claude (Senior SaaS Mode)
> Target: `workspace.hunter3dvisual.com` on Vercel + Supabase + Clerk

---

## AUDIT FINDINGS — Critical Issues Discovered

Sebelum roadmap, ini adalah **6 masalah kritis** yang ditemukan di codebase saat ini:

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| 1 | 🔴 CRITICAL | `prisma/migrations/**/*.sql` ada di `.gitignore` — migrations bị block khỏi git, Vercel deploy sẽ fail | ✅ Removed từ .gitignore |
| 2 | 🔴 CRITICAL | `DATABASE_URL` dùng direct connection (port 5432) — sẽ gây connection exhaustion trên Vercel serverless | ✅ `.env.example` updated với pooler URL |
| 3 | 🟡 HIGH | `ecosystem.config.js` có hardcoded Windows path `D:\Hunter3DVisual_Workspace` — PM2 config không nên commit lên cloud repo | ✅ Thêm vào `.gitignore` |
| 4 | 🟡 HIGH | Clerk env vars dùng deprecated format (`AFTER_SIGN_IN_URL`) → đổi sang `SIGN_IN_FALLBACK_REDIRECT_URL` | ✅ Updated `.env.example` |
| 5 | 🟡 MEDIUM | `ANTHROPIC_API_KEY`, `UPLOADTHING_TOKEN`, `RESEND_API_KEY` chưa set — AI + uploads + email sẽ broken trên prod | ⚠️ Cần set trên Vercel dashboard |
| 6 | 🟢 LOW | Untracked files trong repo: `humanizer-main.zip`, `# AI Style.txt`, `# About Me.txt` — không nên push lên GitHub | ✅ Thêm vào `.gitignore` |

---

## PHASE 1 — GitHub Setup (Hôm nay, ~30 phút)

**Status: Repo đã tồn tại tại `github.com/Hunter3DVisual/Hunter3DVisual_Workspace`**

### 1.1 — Commit các changes hiện tại

```bash
cd D:\Hunter3DVisual_Workspace

# Stage tất cả changes (không commit untracked junk files)
git add src/actions/finance.ts
git add src/app/dashboard/invoices/
git add src/components/documents/DocumentWizard.tsx
git add src/components/documents/templates/InvoiceTemplate.tsx
git add src/types/documents.ts
git add src/types/finance.ts
git add src/app/print/invoices/

# Commit new config files
git add vercel.json
git add .env.example
git add .gitignore
git add .github/
git add CLOUD_MIGRATION_ROADMAP.md

git commit -m "feat: production config — vercel.json, CI/CD, env template, gitignore fix

- Add vercel.json with security headers, region config (sin1), function timeouts
- Add .github/workflows/ci.yml for lint + build + db migration check
- Fix .gitignore: unblock prisma migrations (critical for production)
- Fix .env.example: add Supabase pooler URL format for serverless
- Update Clerk env vars to current format
- Ignore ecosystem.config.js, zip files, personal notes"

git push origin master
```

### 1.2 — Tạo branches cho workflow

```bash
# Main branches
git checkout -b develop && git push origin develop
git checkout master

# Branch protection (trên GitHub web UI):
# Settings → Branches → Add rule → master
# ✅ Require pull request before merging
# ✅ Require status checks (CI workflow)
```

### 1.3 — GitHub Repository Settings

Vào `github.com/Hunter3DVisual/Hunter3DVisual_Workspace/settings`:

- **Visibility**: Private (studio workspace, không public)
- **Topics**: `nextjs`, `archviz`, `studio-management`, `saas`
- **Actions**: Settings → Actions → Allow all actions ✅
- **Secrets**: Settings → Secrets → Actions → thêm tất cả env vars (xem Phase 3)

---

## PHASE 2 — Vercel Deploy (Hôm nay, ~45 phút)

### 2.1 — Connect GitHub → Vercel

1. Vào [vercel.com/new](https://vercel.com/new)
2. "Import Git Repository" → chọn `Hunter3DVisual_Workspace`
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: `.` (root)
5. **Build Command**: `prisma generate && next build` (đã set trong `vercel.json`)
6. **Output Directory**: `.next` (auto)
7. Chưa deploy — set env vars trước (Phase 3)

### 2.2 — Vercel Project Settings

Sau khi import:
- **Project Name**: `hunter3dvisual-workspace`
- **Production Branch**: `master`
- **Preview Branches**: `develop`, `feature/*`

### 2.3 — Deploy

```bash
# Option A: Via Vercel CLI
npm i -g vercel
vercel login
vercel --prod

# Option B: Via GitHub (recommended — triggers CI first)
git push origin master  # → auto-triggers Vercel deploy
```

---

## PHASE 3 — Environment Variables on Vercel (~20 phút)

Vào Vercel Dashboard → Project → Settings → Environment Variables.
Thêm TẤT CẢ variables sau cho **Production** environment:

### Required — App

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://workspace.hunter3dvisual.com` |

### Required — Clerk

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | clerk.com Dashboard → API Keys → **Production** key |
| `CLERK_SECRET_KEY` | clerk.com Dashboard → API Keys → **Production** key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/dashboard` |

> ⚠️ **QUAN TRỌNG**: Dùng Production keys của Clerk, không dùng Development keys cho Vercel.

### Required — Supabase + Database

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `DATABASE_URL` | Supabase → Settings → Database → **Connection Pooling** (port 6543) + `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Supabase → Settings → Database → URI (port 5432) |

### Required — AI

| Variable | Source |
|----------|--------|
| `ANTHROPIC_API_KEY` | console.anthropic.com |

### Optional (khi setup xong)

| Variable | Source |
|----------|--------|
| `UPLOADTHING_TOKEN` | uploadthing.com |
| `RESEND_API_KEY` | resend.com |
| `EMAIL_FROM` | `noreply@hunter3dvisual.com` |
| `CLERK_WEBHOOK_SECRET` | Clerk → Webhooks |

### GitHub Actions Secrets

Vào `github.com/Hunter3DVisual/Hunter3DVisual_Workspace/settings/secrets/actions`:
Thêm tất cả variables trên (cần cho CI build check).

---

## PHASE 4 — Custom Domain Setup (~15 phút)

### 4.1 — Thêm domain vào Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Thêm: `workspace.hunter3dvisual.com`
3. Vercel sẽ hiện DNS records cần add

### 4.2 — DNS Configuration (Hostinger)

Vào [Hostinger DNS Manager](https://horizons.hostinger.com) cho domain `hunter3dvisual.com`:

```
Type    Name        Value                   TTL
CNAME   workspace   cname.vercel-dns.com.   3600
```

> Nếu Vercel yêu cầu A record thay CNAME:
> ```
> A    workspace    76.76.21.21    3600
> ```

### 4.3 — SSL Certificate

Vercel tự động issue Let's Encrypt SSL cho custom domain. Không cần làm gì thêm.

### 4.4 — Clerk Production Domain

1. clerk.com → Your Application → Settings → Domains
2. Thêm `workspace.hunter3dvisual.com` làm production domain
3. Verify domain ownership (thêm DNS TXT record theo hướng dẫn Clerk)

---

## PHASE 5 — Supabase Production Setup

### 5.1 — Database Migrations

```bash
# Chạy migrations lên production database
# (dùng DIRECT_URL, không phải pooler URL)
DATABASE_URL=postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres npx prisma migrate deploy
```

Hoặc thêm vào Vercel Build Command:
```
prisma migrate deploy && prisma generate && next build
```

> ⚠️ Dùng `migrate deploy` (không phải `migrate dev`) trên production.

### 5.2 — Row Level Security (RLS)

Enable RLS cho các tables sensitive trên Supabase:

```sql
-- Chạy trong Supabase SQL Editor
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Ví dụ policy: users chỉ thấy data của mình
CREATE POLICY "Users see own data" ON users
  FOR ALL USING (clerk_id = auth.uid()::text);
```

### 5.3 — Supabase Storage Buckets

```sql
-- Tạo buckets cho assets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('renders', 'renders', false),
  ('assets', 'assets', false),
  ('documents', 'documents', false),
  ('avatars', 'avatars', true);
```

### 5.4 — Connection Pool Settings

Supabase Dashboard → Settings → Database → Connection Pooling:
- **Mode**: Transaction (phù hợp với Vercel serverless)
- **Pool Size**: 15 (default OK cho starter plan)

---

## PHASE 6 — Architecture Improvements

### 6.1 — Folder Structure hiện tại (OK)

```
src/
├── actions/        ✅ Server Actions (10 files)
├── app/            ✅ App Router (15 routes)
├── components/     ✅ Feature-based components
├── lib/            ✅ Utilities
└── types/          ✅ TypeScript types
```

### 6.2 — Recommended additions cho scale

```
src/
├── actions/        # Server Actions
├── app/            # App Router pages
├── components/     # Feature components
│   └── ui/         # Shadcn/Radix primitives
├── hooks/          # 🆕 Custom React hooks (useProjects, useClients...)
├── lib/
│   ├── db.ts       # Prisma client (singleton)
│   ├── supabase.ts # Supabase client
│   ├── utils.ts    # cn(), formatters
│   └── constants.ts # 🆕 App constants
├── stores/         # 🆕 Zustand stores
│   ├── ui.store.ts
│   └── workspace.store.ts
├── types/          # TypeScript types
└── config/         # 🆕 App config (nav, permissions...)
    ├── navigation.ts
    └── permissions.ts
```

### 6.3 — Next.js config improvements

Thêm vào `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config

  // Enable standalone output for Docker (future desktop app)
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  // Logging for production debugging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Bundle analyzer (npm run analyze)
  ...(process.env.ANALYZE === 'true' && {
    // Add bundle-analyzer if needed
  }),
};
```

---

## PHASE 7 — DevOps & Deployment Workflow

### 7.1 — Branch Strategy

```
master (protected)
  ↑ PR + CI pass required
develop
  ↑ feature branches merge here
feature/task-modals
feature/asset-library
feature/automation-engine
hotfix/critical-bug
```

### 7.2 — Deploy Flow

```
Developer → feature/xxx branch
  → git push → GitHub Actions CI (lint + build)
  → PR to develop → review → merge
  → develop → Vercel Preview Deploy (auto)
  → PR to master → CI pass required
  → master → Vercel Production Deploy (auto)
  → workspace.hunter3dvisual.com updated
```

### 7.3 — Auto Deploy Setup

Vercel đã auto-configure điều này khi connect GitHub:
- Push to `master` → Production deploy
- Push to `develop` → Preview deploy (URL: `hunter3dvisual-workspace-git-develop-[team].vercel.app`)
- Push to any branch → Preview deploy

### 7.4 — Database Migration Strategy

```bash
# Local development
npx prisma migrate dev --name "add_feature_x"
# → creates prisma/migrations/[timestamp]_add_feature_x/migration.sql
# → commit to git

# Production (via Vercel build)
# Build command: prisma migrate deploy && prisma generate && next build
# → runs pending migrations before build
```

---

## PHASE 8 — Production Checklist

### Pre-Deploy

- [ ] Tất cả env vars set trên Vercel ✅
- [ ] Prisma migrations committed (không bị .gitignore) ✅
- [ ] Clerk Production keys được dùng (không phải Development)
- [ ] Supabase database có data seed
- [ ] Custom domain verified
- [ ] SSL certificate active

### Security

- [ ] `.env` và `.env.local` không commit lên git ✅ (trong .gitignore)
- [ ] Supabase RLS enabled cho sensitive tables
- [ ] Clerk webhook signature verified trong API route
- [ ] Security headers set ✅ (trong vercel.json)
- [ ] API routes protected bởi Clerk auth

### Performance

- [ ] Images optimized (Next.js Image component)
- [ ] `optimizePackageImports` set cho lucide-react, framer-motion ✅
- [ ] Server Components dùng cho data-fetching (không fetch ở client)
- [ ] Prisma queries có proper `select` (không fetch all fields)

### Monitoring

- [ ] Vercel Analytics enabled (miễn phí)
- [ ] Error monitoring setup (Sentry hoặc Vercel error tracking)
- [ ] Supabase Database monitoring enabled

---

## PHASE 9 — Hosting Strategy

### Current Stack Cost Estimate

| Service | Plan | Cost/month |
|---------|------|-----------|
| Vercel | Hobby (free) → Pro khi cần | $0 → $20 |
| Supabase | Free (500MB, 50k rows) → Pro | $0 → $25 |
| Clerk | Free (10k MAU) → Pro | $0 → $25 |
| Domain | Hostinger (đã có) | ~$15/year |
| **Total** | | **~$0/month** (free tiers) |

### Scale Path

```
Phase 1 (Now):    Free tiers — 0$/month
Phase 2 (Growth): Vercel Pro + Supabase Pro — ~$45/month
Phase 3 (Scale):  Vercel Enterprise + Supabase Pro + CDN — ~$100/month
```

### Region Strategy

- Vercel Region: `sin1` (Singapore) — gần nhất với Vietnam
- Supabase Region: Southeast Asia (Singapore) — match Vercel region
- Clerk: Global edge (auto)

---

## PHASE 10 — Future: Desktop App Preparation

### Electron / Tauri Ready

Để chuẩn bị cho desktop app trong tương lai:

```typescript
// next.config.ts — thêm standalone output
output: 'standalone'  // Bundle tất cả dependencies
```

### Tauri (recommended cho Archviz tool)

```
Stack: Next.js (web view) + Tauri (Rust shell) + Supabase (cloud sync)
Benefits: Native performance, file system access, offline mode
Timeline: Phase 3+ sau khi cloud platform stable
```

---

## QUICK START — Chạy ngay hôm nay

```bash
# 1. Commit + Push
cd D:\Hunter3DVisual_Workspace
git add -A
git commit -m "feat: production-ready cloud config"
git push origin master

# 2. Vercel CLI deploy
npm i -g vercel
vercel login
vercel --prod

# 3. Set environment variables
vercel env add NEXT_PUBLIC_APP_URL production
# (repeat for each env var)

# 4. Add custom domain
vercel domains add workspace.hunter3dvisual.com
```

---

## Vision: Studio Operating System

```
workspace.hunter3dvisual.com
├── /dashboard          → Studio overview + AI insights
├── /projects           → Project pipeline management
├── /clients            → CRM + communication
├── /tasks              → Kanban + time tracking
├── /finance            → Invoices + revenue
├── /documents          → Contracts + proposals
├── /assets             → 3D library (Supabase Storage)
├── /automation         → Workflow automation engine
├── /ai                 → AI assistant (Claude-powered)
└── /team               → Team management
```

**Hunter3DVisual Workspace = The Notion + Linear + Figma for Archviz Studios.**

---

*Last updated: 2026-05-23 | Version: 1.0.0*
