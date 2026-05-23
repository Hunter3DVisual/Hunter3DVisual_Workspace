# CLAUDE.md — Hunter3DVisual Project

> File này được đọc tự động bởi Claude Code mỗi khi bắt đầu session mới.
> Đọc kỹ trước khi làm bất cứ thứ gì. Không hỏi lại những gì đã có ở đây.

## 🚀 Thông tin dự án
- **Server port:** `3001`
- **Auth:** Clerk
- **Database:** Supabase + Prisma (17 models, DB live)
- **Framework:** Next.js (App Router)

## 🎨 Branding
- **Primary color:** `#E8521A`

## ✅ Đã hoàn thành
- 10 dashboard routes + UI components
- Prisma schema 17 models, DB live trên Supabase
- Seed data + Dashboard wired to real DB data
- Clerk auth, AI streaming endpoint, all server actions scaffolded
- Seed 4 clients, hệ thống Documents (HĐ/BBTLHD/Invoice) tại /dashboard/documents
- Form modals Create/Edit cho Projects + Clients
  - `ProjectFormModal.tsx` + `ClientFormModal.tsx` (React Hook Form + Zod)
  - UI components: `Dialog`, `Select`, `Textarea` (Radix UI wrappers)
  - Actions: `updateProject`, `deleteProject`, `updateClient`, `deleteClient`, `getClientsForSelect`
  - UX: hover card → Pencil icon → edit modal prefilled; "New" button → create modal
- Detail pages `/projects/[id]` + `/clients/[id]`
  - Project detail: stat cards (Budget/Progress/Deadline/Tasks), Pipeline stages, Invoices, Edit/Delete
  - Client detail: Profile header, 4 stats, Projects list, Invoices, Contacts, Notes
  - `getProjectById` action, `ProjectDetail` + `ClientDetail` types
  - `ProjectDetailActions.tsx` + `ClientDetailActions.tsx`

## 🔥 Còn lại (theo priority)
- 🔴 Cao: Form modals Create/Edit cho Tasks, Invoices
- 🔴 Cao: Wire real data vào Projects, Clients, Tasks, Finance pages
- 🟡 Trung: Zustand stores + custom hooks
- 🟡 Trung: Asset Library (/dashboard/assets)
- 🟡 Trung: Automation engine
- 🟢 Thấp: ANTHROPIC_API_KEY, Uploadthing, Resend
