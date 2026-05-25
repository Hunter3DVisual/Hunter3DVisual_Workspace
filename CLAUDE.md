# CLAUDE.md — Hunter3DVisual Project

> File này được đọc tự động bởi Claude Code mỗi khi bắt đầu session mới.
> Đọc kỹ trước khi làm bất cứ thứ gì. Không hỏi lại những gì đã có ở đây.

---

## 🚀 Thông tin dự án

| Key | Value |
|-----|-------|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk |
| Database | Supabase + Prisma (17 models, DB live) |
| ORM | Prisma v6 |
| Dev port | `3001` |
| Production | `https://hunter3dvisual-workspace.vercel.app` |
| Repo | `https://github.com/Hunter3DVisual/Hunter3DVisual_Workspace` |
| Branch | `master` → auto-deploy to Vercel |

---

## 🎨 Branding

- **Primary color:** `#E8521A` (orange)
- **Secondary:** `#374151` / `#4b5563` (dark gray)
- **Logo:** `/public/logo.png` (transparent PNG, orange+gray H diamond mark)
- **Font:** Inter (system stack)
- **Invoice style:** Drongo-inspired — clean, minimal, section headers in `#E8521A`

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                  ← Home stats (real DB)
│   │   ├── projects/[id]/page.tsx    ← Project detail
│   │   ├── clients/[id]/page.tsx     ← Client detail
│   │   ├── invoices/page.tsx         ← Invoice list
│   │   ├── invoices/[id]/page.tsx    ← Invoice detail
│   │   ├── documents/page.tsx        ← HĐ / BBTLHD / Invoice docs
│   │   ├── finance/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── assets/page.tsx
│   │   └── settings/page.tsx
│   └── print/
│       └── invoices/[id]/page.tsx    ← Print/PDF invoice view
├── actions/
│   ├── finance.ts                    ← createInvoice, updateInvoice, updateInvoiceStatus, getInvoiceById
│   ├── clients.ts                    ← CRUD + getClientsForSelect
│   ├── projects.ts                   ← CRUD + getProjectsForSelect
│   └── documents.ts
├── components/
│   ├── invoices/
│   │   ├── InvoiceFormModal.tsx      ← Full create/edit modal (RHF + Zod)
│   │   └── InvoiceCard.tsx
│   ├── projects/
│   │   └── ProjectFormModal.tsx
│   └── clients/
│       └── ClientFormModal.tsx
└── types/
    ├── finance.ts                    ← InvoiceWithClient, CreateInvoiceInput, BankingInfo
    ├── clients.ts
    └── documents.ts
```

### Prisma Models (17 total)
`User` · `Client` · `Contact` · `Project` · `PipelineStage` · `Task` · `Invoice` · `Quote` · `Document` · `Asset` · `TeamMember` · `Render` · `Automation` · `AutomationRun` · `ChatSession` · `ChatMessage` · `Notification`

---

## ✅ Đã hoàn thành

### Core Platform
- 10 dashboard routes + UI components (real DB data)
- Clerk auth wired end-to-end
- Prisma schema 17 models, DB live trên Supabase
- Seed data: 4 clients, projects, invoices, pipeline stages

### Projects & Clients
- `ProjectFormModal.tsx` + `ClientFormModal.tsx` (React Hook Form + Zod)
- Detail pages `/projects/[id]` + `/clients/[id]`
- Actions: `updateProject`, `deleteProject`, `updateClient`, `deleteClient`
- UX: hover → Pencil icon → prefilled edit modal; "New" button → create modal

### Invoice System (fully dynamic as of 2026-05-25)
- `InvoiceFormModal.tsx` — full create/edit with:
  - Quick-add category buttons (Exterior/Interior/360/Animation/3D Model)
  - Line items table (category + description + qty + unit price)
  - Tax % + Discount computation
  - Notes with preset templates (Revisions / Delivery / Payment)
  - Banking section — **2 sub-sections**: Receiving Bank + Account Holder
- `contractRef` field on Invoice (optional VN contract number e.g. `0903/2026/HĐ-DHKT/VS-INC`)
- Print page `/print/invoices/[id]` — **zero hardcoded values**:
  - All style, spacing, colors, fonts driven 100% from `studio_settings` DB table
  - Company info driven from DB settings (name, address, email, phone, website, footer)
  - Banking: Receiving Bank on top, Account Holder below (vertical layout)
  - Backward-compatible parser (handles old single-block AND new 2-section format)
  - Logo position configurable (left/right), logo size default 74px
  - `fontFamily` injected into `<style>` tag — body font fully configurable
  - `lineHeight` and `borderRadius` applied globally

### Settings System (fully wired 2026-05-25)
- `StudioSetting` model in DB — key/value store for `company`, `invoice_style`, `banking`
- Settings page `/dashboard/settings` — 3 tabs: Company Info / Invoice Style / Banking Defaults
- **Invoice Style tab** — 4 collapsible sections:
  - **Colors**: brand, text (primary/secondary/muted), surfaces (border, rowAlt, tableHeader, notes, banking cards), Total Due box (bg, label text, amount)
  - **Logo**: height (px) + position (left/right toggle)
  - **Typography**: font family select (Inter/Helvetica/Georgia/System), INVOICE title, section headers, company name/detail, invoice number, status badge, row labels/values, client name/detail, table header/rows, totals, notes, banking rows, footer
  - **Spacing & Layout**: page padding V/H, section gap, table row padding V/H, line height, border radius
- All settings persist to DB via `saveInvoiceStyleSettings()` server action
- Settings read by print page via `getAllSettings()` on every request

### Documents
- `/dashboard/documents` — HĐ / BBTLHD / Invoice document system

---

## 🏦 Banking Defaults (pre-filled in InvoiceFormModal)

```
Receiving Bank:
  Bank:         ACB – Asia Commercial Bank
  Address:      442 Nguyen Thi Minh Khai Street, District 3, Ho Chi Minh City, Vietnam
  Postal Code:  70000

Account Holder:
  Name:         CTY TNHH HUNTER 3DVISUAL
  Account No:   41163457
  SWIFT/BIC:    ASCBVNVX
  Currency:     USD
  Address:      196 Truong Xuan Nam Street, Ngu Hanh Son Ward, Da Nang City, Vietnam
  City:         Da Nang
  Postal Code:  59000
```

Stored in `localStorage` key `h3dv_banking_defaults` — persists per browser. "Save as default" button updates it.

---

## 🔥 Còn lại (theo priority)

### 🔴 Cao
- [ ] Form modals Create/Edit cho **Tasks**
- [ ] Wire real data vào **Tasks page** (`/dashboard/tasks`)
- [ ] Wire real data vào **Finance page** (`/dashboard/finance`) — revenue/expense charts
- [ ] Invoice status actions từ list page (mark PAID, SENT, etc.)

### 🟡 Trung
- [ ] **Asset Library** (`/dashboard/assets`) — upload + manage render files
- [ ] Zustand stores + custom hooks (global state)
- [ ] Automation engine (`/dashboard/automations`)
- [ ] Quote system (model exists, UI missing)

### 🟢 Thấp
- [ ] `ANTHROPIC_API_KEY` — AI chat endpoint (`/api/ai/chat`)
- [ ] Uploadthing — file uploads for assets
- [ ] Resend — email delivery for invoices
- [ ] PDF export button on print page (currently browser print)

---

## 🚢 Deployment

- **Platform:** Vercel (auto-deploy on push to `master`)
- **Database:** Supabase PostgreSQL (live, shared dev+prod)
- **Schema changes:** use `npx prisma db push` (NOT `migrate dev` — DB has drift from migration history)
- **After schema change:** Prisma Client auto-regenerates via `db push`

### Env vars needed on Vercel
```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
# Optional / not yet active:
ANTHROPIC_API_KEY
UPLOADTHING_SECRET
RESEND_API_KEY
```

---

## ⚙️ Important Dev Notes

- **Schema changes:** Always use `npx prisma db push` — `migrate dev` fails due to drift
- **Invoice number format:** `INV-YYYYMM-NNN` (auto-generated)
- **Contract ref format:** `0903/2026/HĐ-DHKT/VS-INC` (optional, manual entry)
- **`(invoice as any).contractRef`** — needed until Prisma Client fully regenerates in IDE cache
- **Banking serialization:** `terms` field stores banking as structured text block starting with `─── Banking / Payment Details ───`. Two sub-sections `[Receiving Bank]` and `[Account Holder]`. Print page parser handles both old (single-section) and new (two-section) format.
- **Print page** is a pure server component — no client JS, safe for PDF via browser print
- **Settings fallback:** `getSetting()` merges DB value with `DEFAULT_STYLE` — new fields added to type automatically get their defaults for existing users without migration
- **InvoiceStyle type** (`src/types/settings.ts`) has ~35 fields. DEFAULT_STYLE in `src/actions/settings.ts` is the single source of truth for defaults. When adding new style fields, add to both type AND DEFAULT_STYLE.
- **Banking defaults** also synced to `localStorage` key `h3dv_banking_defaults` when saved — so InvoiceFormModal picks them up client-side
