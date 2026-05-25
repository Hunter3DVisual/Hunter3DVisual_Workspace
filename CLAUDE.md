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
│   │   ├── page.tsx                      ← Home stats (real DB)
│   │   ├── projects/[id]/page.tsx        ← Project detail
│   │   ├── clients/[id]/page.tsx         ← Client detail
│   │   ├── invoices/page.tsx             ← Invoice list
│   │   ├── invoices/[id]/page.tsx        ← Invoice detail
│   │   ├── documents/page.tsx            ← HĐ / BBTLHD / Invoice docs
│   │   ├── finance/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── assets/page.tsx
│   │   └── settings/page.tsx
│   └── print/
│       ├── invoices/[id]/page.tsx        ← Print/PDF invoice (pure server component)
│       └── invoices/PrintActions.tsx     ← "Export PDF" button (client component)
├── actions/
│   ├── finance.ts                        ← createInvoice, updateInvoice, updateInvoiceStatus, getInvoiceById
│   ├── clients.ts                        ← CRUD + getClientsForSelect
│   ├── projects.ts                       ← CRUD + getProjectsForSelect
│   ├── settings.ts                       ← getAllSettings, getCompanySettings, saveInvoiceStyleSettings, DEFAULT_STYLE
│   └── documents.ts
├── components/
│   ├── invoices/
│   │   ├── InvoiceFormModal.tsx          ← Full create/edit modal (RHF + Zod)
│   │   └── InvoiceCard.tsx
│   ├── settings/
│   │   └── SettingsClient.tsx            ← 3-tab settings UI (Company / Invoice Style / Banking)
│   ├── projects/
│   │   └── ProjectFormModal.tsx
│   └── clients/
│       └── ClientFormModal.tsx
└── types/
    ├── finance.ts                        ← InvoiceWithClient, CreateInvoiceInput, BankingInfo
    ├── settings.ts                       ← InvoiceStyle (62 fields), CompanyInfo, StudioSettings
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
- `ClientFormModal` fields: name, company, email, status, phone, whatsapp, **website**, **taxCode**, country, city, **address**, representative, position, notes (14 fields total)

### Invoice System ✅ COMPLETE (as of 2026-05-25)

#### InvoiceFormModal (`src/components/invoices/InvoiceFormModal.tsx`)
- Full create/edit modal — React Hook Form + Zod
- Quick-add category buttons: Exterior $400 / Interior $150 / 360° Image $500 / 360° Tour $500 / Animation $800 / 3D Model $600 / Custom
- Line items table: category + description + qty + unit price + auto-total
- Tax % + Discount fields with live computation (subtotal → tax → discount → total due)
- Notes field with 3 preset templates (Revisions / Delivery / Payment)
- Banking section — 2 sub-sections: **Receiving Bank** + **Account Holder**
- `contractRef` field — optional VN contract number (e.g. `0903/2026/HĐ-DHKT/VS-INC`)
- Banking pre-filled from `localStorage` key `h3dv_banking_defaults`; "Save as default" persists

#### Print Page (`src/app/print/invoices/[id]/page.tsx`)
Pure server component (~530 lines). Zero hardcoded values — 100% driven by DB settings.

**Header:**
- Logo: configurable height (default 74px), position left/right, X/Y offset via `transform: translate(X, Y)`
- Company block: name/address/email/phone/website from `company` settings key
- INVOICE title + invoice number + status badge with color per status

**Invoice Details column (left)** — 3-column CSS Grid (`110px | 14px | 1fr`):
- Issue Date : value
- Due Date   : value
- Currency   : value
- Contract Ref : `monospace` value (optional, only shown if set)
- Project    : `[code]` name — separated by thin top border (moved here from Bill To)
- All colons aligned in fixed 14px center column

**Bill To column (right):**
- Client name (configurable size/weight/italic/underline)
- Company name
- Address block (street → city/country)
- Phone
- Website (clickable `<a>` tag with brand color)
- Tax ID / VAT (label text configurable via `style.clientTaxLabel`)

**Line Items table:**
- Category badge: neutral gray style (same as Custom) for all categories in PDF — no colored badges
- Description, Qty, Unit Price, Total columns
- Alternating row background (`rowAltBg`)

**Totals:**
- Subtotal / Tax / Discount rows (conditional)
- Total Due box: dark bg, configurable colors, large amount in brand color

**Notes section:** shown only if `invoice.notes` set

**Banking / Payment Details:**
- Parsed from `invoice.terms` field (structured text block)
- 2 cards: Receiving Bank (top) + Account Holder (bottom)
- Each card: 3-col grid (`bankingLabelWidth px | 14px | 1fr`) — label left-aligned | `:` fixed col | value
- Row dividers (subtle 5% opacity), vertical breathing room per `bankingRowGap`
- Backward-compatible parser handles both old single-block AND new 2-section format

**Footer:** from `company.footer` setting

#### Settings System (`src/components/settings/SettingsClient.tsx`)
3 tabs: **Company Info** / **Invoice Style** / **Banking Defaults**

**Invoice Style tab** — 5 collapsible accordion sections:

1. **Colors**
   - Brand color, text (primary/secondary/muted)
   - Surfaces: border, rowAlt, tableHeader, notes bg, banking card bg
   - Total Due box: background, label text color, amount color

2. **Logo**
   - Height in px (slider)
   - Position: Left / Right toggle
   - Offset X / Y (px) — moves logo without affecting layout flow

3. **Typography**
   - Font family: Inter / Helvetica Neue / Georgia / System
   - Per-element controls (font size + weight picker + italic toggle):
     - INVOICE title, status badge, footer
     - Company name, company detail lines
     - Section headers (Invoice Details / Bill To / Banking)
     - Invoice number, row labels, row values
     - Client name (+ underline toggle), client detail lines
     - Table header, table rows
     - Total labels, Total Due label, Total Due amount
     - Notes text
     - Banking section title, banking labels, banking values

4. **Banking Typography & Spacing**
   - Banking section title color + weight
   - Label color/weight/italic, value color/weight/italic
   - Label column width (px), row gap (px)
   - Card padding V/H (px), gap between cards (px)

5. **Spacing & Layout**
   - Page padding V/H (px)
   - Section gap (px)
   - Table row padding V/H (px)
   - Line height (multiplier)
   - Border radius (px)

All settings persist to DB via `saveInvoiceStyleSettings()`. Read by print page via `getAllSettings()` on every request.

### Documents
- `/dashboard/documents` — HĐ / BBTLHD / Invoice document system

---

## 🗄️ DB Structure — Invoice-Related

### `Invoice` model (key fields)
```
id, invoiceNumber (INV-YYYYMM-NNN), status, issueDate, dueDate
clientId, projectId (optional)
subtotal, tax, discount, total
currency (default USD)
notes (optional text)
terms   ← stores banking info as structured text block (see parsing below)
contractRef  ← optional VN contract number, added via prisma db push
```

### `StudioSetting` model
```
key   String @unique   ← "company" | "invoice_style" | "banking"
value String           ← JSON serialized
```

### `Client` model (fields used in invoice Bill To)
```
name, company, email, phone, whatsapp
address, city, country   ← address block
website, taxCode         ← added to CRM form
representative, position, notes, tags
```

### Banking serialization format (`Invoice.terms`)
```
─── Banking / Payment Details ───

[Receiving Bank]
Bank: ACB – Asia Commercial Bank
Address: 442 Nguyen Thi Minh Khai...
Postal Code: 70000

[Account Holder]
Name: CTY TNHH HUNTER 3DVISUAL
Account No: 41163457
SWIFT/BIC: ASCBVNVX
Currency: USD
Address: 196 Truong Xuan Nam...
City: Da Nang
Postal Code: 59000
```
Parser in print page handles both new 2-section format AND legacy single-section format.

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

Stored in `localStorage` key `h3dv_banking_defaults` — persists per browser. "Save as default" button updates it. Also mirrored in `StudioSetting` key `banking` in DB.

---

## ⚠️ Known Limitations & Bugs

- **`(invoice as any).contractRef`** — TypeScript cast needed in print page until Prisma Client fully regenerates in IDE cache. Functionally correct; just a type inference lag.
- **`CAT_COLOR` dead code** — the constant is still defined in print page but no longer referenced (removed after neutralizing badge colors). Safe to delete in a future cleanup.
- **No native PDF export** — "Export PDF" button triggers browser print dialog. No headless PDF generation (Puppeteer/playwright not wired).
- **No email delivery** — Resend API key not active. Invoice must be manually shared via print/screenshot.
- **Invoice status from list page** — cannot mark PAID/SENT directly from `/dashboard/invoices`. Must navigate to detail page.
- **Banking stored as text** — `Invoice.terms` is a freeform text field. Not structured DB columns. Robust parser handles it but editing banking info requires opening edit modal and re-submitting.
- **Settings merge is one-way** — `getSetting()` merges DB JSON with DEFAULT_STYLE. You cannot "null out" a field via settings UI — it will always fall back to the DEFAULT_STYLE value.
- **Single user only** — no multi-tenant / per-user settings isolation yet.

---

## 🔥 Còn lại (theo priority)

### 🔴 Cao
- [ ] Form modals Create/Edit cho **Tasks**
- [ ] Wire real data vào **Tasks page** (`/dashboard/tasks`)
- [ ] Wire real data vào **Finance page** (`/dashboard/finance`) — revenue/expense charts
- [ ] Invoice status quick-actions from list page (mark PAID, SENT, etc.)

### 🟡 Trung
- [ ] **Asset Library** (`/dashboard/assets`) — upload + manage render files
- [ ] Zustand stores + custom hooks (global state)
- [ ] Automation engine (`/dashboard/automations`)
- [ ] Quote system (model exists, UI missing)

### 🟢 Thấp
- [ ] `ANTHROPIC_API_KEY` — AI chat endpoint (`/api/ai/chat`)
- [ ] Uploadthing — file uploads for assets
- [ ] Resend — email delivery for invoices
- [ ] Native PDF export (Puppeteer / @react-pdf/renderer)

---

## 🧾 Invoice Next Steps (future improvements)

- **Native PDF** — Add Puppeteer or `@react-pdf/renderer` for server-side PDF generation; replace browser print dialog with a download button
- **Email delivery** — Wire Resend to send invoice as PDF attachment directly from invoice detail page
- **Status quick-actions** — One-click PAID / SENT / CANCELLED from invoice list page (no navigation required)
- **Partial payments** — Track multiple payment events against a single invoice (new `Payment` model)
- **Quote → Invoice conversion** — Build Quote UI, then add "Convert to Invoice" flow
- **Multiple invoice templates** — Store `templateId` in Invoice; support 2–3 layout variants (current is "Classic")
- **Invoice duplication** — "Duplicate" button on detail page to clone an invoice with new number
- **Client portal** — Public `/invoices/view/[token]` page for clients to view + confirm receipt
- **Currency formatting** — Support VND (₫), EUR (€) with correct locale formatting
- **Overdue automation** — Cron job to auto-flip status to OVERDUE when dueDate passes
- **Clean up `CAT_COLOR`** — Dead code in print page, safe to remove

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
- **Invoice number format:** `INV-YYYYMM-NNN` (auto-generated in `createInvoice` action)
- **Contract ref format:** `0903/2026/HĐ-DHKT/VS-INC` (optional, manual entry, stored in `contractRef` column)
- **`InvoiceStyle` type** (`src/types/settings.ts`) has **62 fields**. `DEFAULT_STYLE` in `src/actions/settings.ts` is the single source of truth for all defaults. When adding new style fields: add to **both** the type AND `DEFAULT_STYLE` — `getSetting()` merges them automatically so existing users get the new default without a DB migration.
- **Print page** is a pure server component — no client JS, safe for PDF via browser print. `PrintActions.tsx` is the only client boundary (just the Export PDF button).
- **Banking defaults** dual-stored: `StudioSetting` key `banking` in DB (for server) AND `localStorage` key `h3dv_banking_defaults` (for `InvoiceFormModal` client-side pre-fill). Keep both in sync when changing banking defaults.
- **Invoice Details 3-col grid:** `gridTemplateColumns: "110px 14px 1fr"` — label (left) | colon (center) | value (left + paddingLeft 6). Mirror of banking row pattern.
- **Banking 3-col grid:** `gridTemplateColumns: "${style.bankingLabelWidth}px 14px 1fr"` — label column width is user-configurable in Settings.
- **Service badges in print:** All rendered as neutral gray (`#6b7280`) regardless of category — no colorful badges in PDF output. Dashboard/form UI still uses full color palette.
- **`fontFamily`** injected into `<style>` tag in print page head — applies to entire document body. All other style values applied inline.
