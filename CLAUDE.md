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
│   │   ├── invoices/[id]/page.tsx        ← Invoice detail + delete
│   │   ├── documents/page.tsx            ← HĐ / BBTLHD / Invoice docs
│   │   ├── finance/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── assets/page.tsx
│   │   └── settings/page.tsx
│   └── print/
│       ├── invoices/[id]/page.tsx        ← Print/PDF invoice (pure server component)
│       └── invoices/PrintActions.tsx     ← "Export PDF" button (client component)
├── actions/
│   ├── finance.ts                        ← createInvoice, updateInvoice, deleteInvoice,
│   │                                        updateInvoiceStatus, getInvoiceById,
│   │                                        getProjectsForSelect, getFinanceStats
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
- ProjectFormModal: clear description/deadline properly (null vs undefined), save error banner

---

## 🧾 Invoice & Quote System ✅ MODULE COMPLETE (as of 2026-05-25)

### InvoiceFormModal (`src/components/invoices/InvoiceFormModal.tsx`)
Full create/edit modal — React Hook Form + Zod. Key behaviors:

- **Quick-add category buttons:** Exterior $400 / Interior $150 / 360° Image $500 / 360° Tour $500 / Animation $800 / 3D Model $600 / Custom
- **Line items table:** category selector + description + qty + unit price + auto-total per row
- **Tax % + Discount:** live computation (subtotal → +tax → −discount → Total Due)
  - ⚠️ Calculations inside `onSubmit` use `values.taxPct` / `values.discount` (Zod-coerced numbers), NOT `watch()` raw values which return strings after user types → avoids `TypeError: .toFixed is not a function`
- **Notes** field with 3 preset templates (Revisions / Delivery / Payment)
- **Banking section** (collapsible) — 2 sub-sections: **Receiving Bank** + **Account Holder**
- **`contractRef`** field — optional VN contract number (e.g. `0903/2026/HĐ-DHKT/VS-INC`)
- **Banking pre-fill:** from `localStorage` key `h3dv_banking_defaults`; "Save as default" persists
- **Invoice # is `readOnly` in edit mode** — invoice numbers are immutable after creation (labeled "read-only · số HĐ không đổi")
- **Project Prefix** field — free-text helper for auto-naming Quick Add items (e.g. "VM Park 2025"); NOT auto-filled from project, user types manually
- **Error display:** save errors shown in red banner above footer buttons (with error digest for Vercel log lookup)
- **Form reset:** `useEffect([open])` always resets form with latest invoice data on open — prevents stale data

### Invoice Detail Page (`src/app/dashboard/invoices/[id]/page.tsx`)
- View invoice with all fields, status badge, meta cards
- Status actions: Mark as Sent / Mark as Paid / Cancel
- **Delete invoice:** "Delete" button (far right of action bar, muted) → 2-step confirm: "Delete permanently? [Yes, delete] [No]" → deletes record → redirects to `/dashboard/invoices`
- Edit opens `InvoiceFormModal` pre-filled; on close calls `load()` to refresh local state

### Print Page (`src/app/print/invoices/[id]/page.tsx`)
Pure server component. Zero hardcoded values — 100% driven by DB settings.

**Header:**
- Logo: configurable height (default 74px), position left/right, X/Y offset via `transform: translate(X, Y)`
- Company block: name/address/email/phone/website from `company` settings key
- INVOICE title + invoice number + status badge with color per status

**Invoice Details column (left)** — 3-column CSS Grid (`110px | 14px | 1fr`):
- Issue Date / Due Date / Currency / Contract Ref (optional, monospace) / Project (`[code]` name)
- All colons aligned in fixed 14px center column

**Bill To column (right):**
- Client name (configurable size/weight/italic/underline)
- Company name, address block (street → city/country), phone
- Website (clickable `<a>` tag with brand color)
- Tax ID / VAT (label text configurable via `style.clientTaxLabel`)

**Line Items table:**
- Category badge: **neutral gray for all categories in PDF** — no colored badges (color only in UI)
- Description, Qty, Unit Price, Total columns; alternating row background (`rowAltBg`)

**Totals:** Subtotal / Tax / Discount rows (conditional) + Total Due box (dark bg, configurable)

**Notes section:** shown only if `invoice.notes` set

**Banking / Payment Details:**
- Parsed from `invoice.terms` field (structured text block)
- 2 cards: Receiving Bank (top) + Account Holder (bottom)
- Each card: 3-col grid (`bankingLabelWidth px | 14px | 1fr`)
- Backward-compatible parser handles both new 2-section AND legacy single-block format

**Footer:** from `company.footer` setting

### Settings System (`src/components/settings/SettingsClient.tsx`)
3 tabs: **Company Info** / **Invoice Style** / **Banking Defaults**

**Invoice Style tab** — 5 collapsible accordion sections:

1. **Colors** — Brand color, text (primary/secondary/muted), surfaces (border, rowAlt, tableHeader, notes bg, banking card bg), Total Due box (bg, label color, amount color)

2. **Logo** — Height px (slider), Position Left/Right toggle, Offset X/Y (px)

3. **Typography** — Font family (Inter / Helvetica Neue / Georgia / System), per-element size + weight + italic controls for: INVOICE title, status badge, footer, company name/detail, section headers, invoice number, row labels/values, client name (+underline), client details, table header/rows, total labels, Total Due label/amount, notes text, banking title/labels/values

4. **Banking Typography & Spacing** — Section title color/weight, label/value color/weight/italic, label column width, row gap, card padding V/H, card gap

5. **Spacing & Layout** — Page padding V/H, section gap, table row padding V/H, line height multiplier, border radius

All settings persist to DB via `saveInvoiceStyleSettings()`. Read by print page via `getAllSettings()` on every request.

### Server Actions — `src/actions/finance.ts`

| Action | Notes |
|--------|-------|
| `createInvoice(input)` | Auto-generates number `INV-YYMM-NNN`; converts `dueDate` string → `new Date()` server-side |
| `updateInvoice(id, input)` | Omits `number` (immutable); uses `?? undefined` for optional fields so `null` explicitly clears DB values |
| `deleteInvoice(id)` | Hard delete; called from detail page with 2-step confirm |
| `updateInvoiceStatus(id, status)` | Sets `paidAt` if status = PAID |
| `getInvoiceById(id)` | Includes full `client` + `project` select |
| `getProjectsForSelect()` | Returns `{ id, name, code }` for dropdowns |
| `getFinanceStats()` | Revenue/pending aggregates for dashboard |

### Quote System
- `Quote` Prisma model exists in schema (same structure as Invoice)
- **UI not yet built** — no form modal, no list page, no detail page
- Future: Quote → Invoice conversion flow

---

## 🗄️ DB Structure — Invoice-Related

### `Invoice` model (key fields)
```
id, number (INV-YYMM-NNN), status (DRAFT|SENT|VIEWED|PARTIAL|PAID|OVERDUE|CANCELLED)
issueDate (@default now()), dueDate, paidAt
clientId, projectId (optional)
subtotal, tax (@default 0), discount (@default 0), total
currency (@default "USD")
notes (optional text)
terms   ← stores banking info as structured text block
contractRef  ← optional VN contract number (added via prisma db push)
items   ← Json — array of {category?, description, quantity, unitPrice, total}
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
Bank Address: 442 Nguyen Thi Minh Khai Street, District 3, Ho Chi Minh City, Vietnam
Bank Postal Code: 70000

[Account Holder]
Account Name: CTY TNHH HUNTER 3DVISUAL
Account No: 41163457
SWIFT/BIC: ASCBVNVX
Currency: USD
Holder Address: 196 Truong Xuan Nam Street, Ngu Hanh Son Ward, Da Nang City, Vietnam
Holder City: Da Nang
Holder Postal Code: 59000
```
Parser in print page handles both new 2-section format AND legacy single-section format.
**Separator constant:** `BANKING_SEP = "─── Banking / Payment Details ───"` (used to split notes from banking block on re-save).

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

Stored in `localStorage` key `h3dv_banking_defaults` — persists per browser. "Save as default" updates it.
Also mirrored in `StudioSetting` key `banking` in DB (for server-side reads).
**Keep both in sync** when changing banking defaults.

---

## 📄 Documents ✅ TEMPLATES LOCKED (as of 2026-05-25)

### File structure
```
src/components/documents/
├── templates/
│   ├── ContractTemplate.tsx      ← HĐ — bilingual service contract (6 articles)
│   ├── LiquidationTemplate.tsx   ← BBTLHD — bilingual liquidation minutes (2 articles)
│   └── InvoiceTemplate.tsx       ← Drongo-style invoice (separate from legal docs)
├── DocumentCard.tsx              ← List card (type badge, status, client, project, total)
├── DocumentsHeader.tsx           ← Type tabs + status filter + New Document button
└── DocumentWizard.tsx            ← 5-step create wizard (Type→Client→Details→Preview→Save)
src/app/dashboard/documents/
├── page.tsx                      ← List with type/status filters (real DB)
├── new/page.tsx                  ← Hosts DocumentWizard
└── [id]/page.tsx                 ← Detail view — renders correct template + Duplicate/Delete
src/actions/documents.ts          ← getDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, duplicateDocument
```

### Document naming convention
| Type | Format |
|------|--------|
| **HĐ** | `{ProjectName}_{DDMMYYYY}HĐ-DHKTVS-INC_HD` |
| **BBTLHD** | `{ProjectName}_{DDMMYYYY}HĐ-DHKTVS-INC_BBTLHD` |

Example: `VM Park_09032026HĐ-DHKTVS-INC_HD`

### ContractTemplate (HĐ) — locked format
- **Title:** HỢP ĐỒNG DỊCH VỤ DIỄN HỌA KIẾN TRÚC / ARCHITECTURAL VISUALIZATION SERVICE CONTRACT
- **6 articles:** Scope of Work · Duration & Location · Contract Value & Payment · Responsibilities · Dispute Resolution · Contract Validity
- **Party A label:** BÊN A: BÊN THUÊ DỊCH VỤ (Party A – Service Client)
- **Party B label:** BÊN B: BÊN CUNG CẤP DỊCH VỤ (Party B – Service Provider)
- **Legal basis:** Căn cứ / Pursuant to — 3 fixed legal references
- **Scope items:** rendered as `- Diễn họa trọn gói cho dự án: {description} / Số lượng: {quantity} view phối cảnh` + 5 fixed service lines
- **Payment account:** ACB, STK 41163457, SWIFT ASCBVNVX (hardcoded Party B)

### LiquidationTemplate (BBTLHD) — locked format
- **Title:** BIÊN BẢN THANH LÝ HỢP ĐỒNG / CONTRACT LIQUIDATION MINUTES
- **2 articles:** Contract Liquidation Contents · General Provisions
- **Party info:** 3-column table format (Label : Value)
- **"Căn cứ:"** = bold + italic (confirmed from Word XML)
- **"Chúng tôi gồm:"** = 14pt (sz=28, confirmed from Word XML)
- **View count** in Article 1.3 = sum of all `scopeItems[].quantity`

### Typography — confirmed from Word XML (docx internal styles)
| Property | Value |
|----------|-------|
| Font | Times New Roman |
| Body size | 12pt (sz=24 half-pts) |
| Line height | 1.12 (line=269/240, rule=auto) |
| Address lines | 1.5x (line=360/240) |
| Color | #000000 (pure black) |
| HD divider | `──────` at 10pt (sz=20) |
| BBTLHD divider | `-----` in Arial font |

### Party B constants (hardcoded in both templates)
```
Phạm Thị Thanh Thủy / Pham Thi Thanh Thuy — Giám đốc / Director
CÔNG TY TNHH HUNTER 3DVISUAL / HUNTER 3DVISUAL LLC
196 đường Trương Xuân Nam, Phường Ngũ Hành Sơn, Thành phố Đà Nẵng, Việt Nam.
MST: 0401961868 | Phone: 0979592543
Bank: ACB – Asia Commercial Bank | STK: 41163457 | SWIFT: ASCBVNVX
```

### Dynamic fields per document
| Field | HĐ | BBTLHD |
|-------|----|--------|
| contractNumber | ✅ | ✅ (in Căn cứ + Article 1) |
| signDate | ✅ | ✅ (original contract date) |
| startDate / endDate | ✅ | — |
| liquidationDate | — | ✅ |
| clientInfo | ✅ (inline list) | ✅ (3-col table) |
| scopeItems[].description | ✅ (project name) | — |
| scopeItems[].quantity | ✅ (view count) | ✅ (totalViews = sum) |
| totalAmount | ✅ (Article 3, with VI+EN words) | — |

### ⚠️ DO NOT CHANGE without explicit request
- All article text, legal wording, bilingual phrasing is locked to match the real Word contract templates used with clients.
- Party B info (name, title, bank, tax code) is hardcoded constants — do not pull from DB/settings.
- Typography values were extracted directly from docx XML — do not adjust.

---

## ⚠️ Known Limitations

- **No native PDF export** — "Export PDF" button triggers browser print dialog. No headless PDF generation (Puppeteer/playwright not wired).
- **No email delivery** — Resend API key not active. Invoice must be manually shared via print/screenshot.
- **Invoice status from list page** — cannot mark PAID/SENT directly from `/dashboard/invoices`. Must navigate to detail page.
- **Banking stored as text** — `Invoice.terms` is freeform text. Not structured DB columns. Robust parser handles it but editing banking info requires opening edit modal and re-submitting.
- **Settings merge is one-way** — `getSetting()` merges DB JSON with DEFAULT_STYLE. Cannot "null out" a field via settings UI — always falls back to DEFAULT_STYLE value.
- **Single user only** — no multi-tenant / per-user settings isolation yet.
- **`(invoice as any).contractRef`** — TypeScript cast in modal; `InvoiceWithClient` type doesn't expose `contractRef` explicitly. Runtime is correct; cast is a workaround until type is widened.
- **Quote UI missing** — `Quote` model exists in DB but no form, list page, or detail page built yet.

---

## 🔥 Còn lại (theo priority)

### 🔴 Cao
- [ ] Form modals Create/Edit cho **Tasks**
- [ ] Wire real data vào **Tasks page** (`/dashboard/tasks`)
- [ ] Wire real data vào **Finance page** (`/dashboard/finance`) — revenue/expense charts
- [ ] Invoice status quick-actions from list page (mark PAID, SENT directly without navigating)

### 🟡 Trung
- [ ] **Quote system** — UI: form modal, list page, detail page; "Convert to Invoice" flow
- [ ] **Asset Library** (`/dashboard/assets`) — upload + manage render files
- [ ] Automation engine (`/dashboard/automations`)
- [ ] Zustand stores + custom hooks (global state)

### 🟢 Thấp
- [ ] `ANTHROPIC_API_KEY` — AI chat endpoint (`/api/ai/chat`)
- [ ] Uploadthing — file uploads for assets
- [ ] Resend — email delivery for invoices
- [ ] Native PDF export (Puppeteer / @react-pdf/renderer)

---

## 🧾 Invoice Future Improvements

- **Native PDF** — Puppeteer or `@react-pdf/renderer` for server-side PDF; replace browser print dialog
- **Email delivery** — Resend: send invoice as PDF attachment directly from detail page
- **Status quick-actions** — One-click PAID / SENT / CANCELLED from invoice list (no navigation)
- **Partial payments** — Track multiple payment events per invoice (new `Payment` model)
- **Quote → Invoice conversion** — After Quote UI built, add "Convert to Invoice" flow
- **Multiple invoice templates** — Store `templateId` in Invoice; support 2–3 layout variants
- **Invoice duplication** — "Duplicate" button to clone with new number
- **Client portal** — Public `/invoices/view/[token]` for clients to view + confirm receipt
- **Currency formatting** — VND (₫), EUR (€) with correct locale formatting
- **Overdue automation** — Cron job to auto-flip status to OVERDUE when dueDate passes

---

## 🚢 Deployment

- **Platform:** Vercel (auto-deploy on push to `master`)
- **Database:** Supabase PostgreSQL (live, shared dev+prod)
- **Schema changes:** use `npx prisma db push` (NOT `migrate dev` — DB has drift from migration history)
- **After schema change:** Prisma Client auto-regenerates via `db push`
- **CI:** GitHub Actions — Lint & Type Check is the hard gate; Build Check has `continue-on-error: true` (requires Clerk secrets not in CI; Vercel is the authoritative build)

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
- **Invoice number format:** `INV-YYMM-NNN` — 2-digit year + 2-digit month + 3-digit random (e.g. `INV-2605-347`). Seed data uses a different format (`INV-2025-005`); both coexist fine.
- **Contract ref format:** `0903/2026/HĐ-DHKT/VS-INC` (optional, manual entry, stored in `contractRef` column)
- **`InvoiceStyle` type** (`src/types/settings.ts`) has **62 fields**. `DEFAULT_STYLE` in `src/actions/settings.ts` is the single source of truth for all defaults. When adding new style fields: add to **both** the type AND `DEFAULT_STYLE` — `getSetting()` merges automatically so existing users get the new default without a DB migration.
- **Print page** is a pure server component — no client JS, safe for PDF via browser print. `PrintActions.tsx` is the only client boundary (Export PDF button).
- **Banking defaults** dual-stored: `StudioSetting` key `banking` in DB (server) AND `localStorage` key `h3dv_banking_defaults` (client pre-fill in modal). Keep both in sync.
- **Invoice Details 3-col grid:** `gridTemplateColumns: "110px 14px 1fr"` — label | `:` fixed col | value. Mirror of banking row pattern.
- **Banking 3-col grid:** `gridTemplateColumns: "${style.bankingLabelWidth}px 14px 1fr"` — label width is user-configurable in Settings.
- **Service badges in print:** All rendered as neutral gray (`#6b7280`) regardless of category — no colorful badges in PDF. Dashboard/form UI still uses full color palette.
- **`fontFamily`** injected into `<style>` tag in print page head — applies to entire document body. All other style values applied inline.
- **`watch()` vs `values` in RHF:** `watch()` returns raw HTML strings after user input. `values` inside `onSubmit` are Zod-coerced. Always use `values.fieldName` for numeric calculations in submit handlers — never `watch()`.
- **Prisma `undefined` vs `null`:** `undefined` = Prisma ignores the field (no update). `null` = Prisma explicitly clears the field. Use `?? undefined` (not `|| undefined`) for optional fields so `null` passes through correctly.
- **Invoice # is immutable** after creation. `updateInvoice` action intentionally omits `number` from the Prisma update `data` object. Field is `readOnly` in edit modal UI.
