# Hunter3DVisual Workspace

## Mục tiêu
AI-powered OS (Operating System) cho Archviz studio — quản lý toàn bộ vòng đời dự án kiến trúc 3D: từ tiếp nhận brief khách hàng, sản xuất (modeling → rendering), tài chính, đến bàn giao. Tích hợp AI assistant (Claude) để tự động hóa workflow.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS 3 + custom design tokens |
| Components | shadcn/ui (Radix UI primitives) |
| Database | PostgreSQL via Supabase + Prisma ORM |
| Auth | Clerk (OAuth, JWT, middleware) |
| AI | Anthropic Claude API + Vercel AI SDK (streaming) |
| State | Zustand |
| Animation | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| File Upload | Uploadthing |
| Email | Resend |
| Icons | Lucide React |

---

## Cấu trúc Folder

```
src/
├── app/
│   ├── (auth)/sign-in|sign-up/     # Clerk auth pages
│   ├── api/ai/chat/route.ts        # Anthropic streaming endpoint
│   └── dashboard/                  # Protected routes
│       ├── layout.tsx              # Sidebar + Header wrapper
│       ├── page.tsx                # Dashboard overview
│       ├── projects/page.tsx
│       ├── clients/page.tsx
│       ├── tasks/page.tsx
│       ├── pipeline/page.tsx
│       ├── finance/page.tsx
│       ├── invoices/page.tsx
│       ├── team/page.tsx
│       ├── ai/page.tsx
│       └── automation/page.tsx
├── components/
│   ├── ui/                         # shadcn/ui base components
│   ├── layout/header.tsx sidebar.tsx
│   ├── dashboard/                  # Hero, StatsGrid, RevenueChart, etc.
│   ├── projects/ clients/ tasks/
│   ├── pipeline/ finance/ invoices/
│   ├── team/ ai/ automation/
├── types/
│   ├── index.ts                    # Central re-exports + shared types
│   └── projects|clients|tasks|pipeline|finance|invoices|team|ai|automation.ts
├── actions/                        # Next.js Server Actions ("use server")
│   └── projects|clients|tasks|pipeline|finance|invoices|team|ai|automation.ts
├── lib/
│   ├── db.ts / prisma.ts           # Prisma client singleton
│   ├── supabase.ts                 # Supabase client
│   └── utils.ts                    # cn(), formatCurrency(), formatDate(), etc.
├── middleware.ts                   # Clerk auth guard
└── globals.css
prisma/
└── schema.prisma                   # 13 models, 8 enums
```

---

## Database Schema (Prisma)

**Models:** User, Client, Contact, Project, PipelineStage, Task, Invoice, Quote, Asset, Render, TeamMember, Comment, Notification, Automation, AutomationRun, ChatSession, ChatMessage

**Key Enums:**
- `ProjectStatus`: BRIEF → CONCEPT → MODELING → LIGHTING → RENDERING → POST → REVIEW → DELIVERED → ARCHIVED
- `TaskStatus`: BACKLOG | TODO | IN_PROGRESS | REVIEW | DONE | CANCELLED
- `TaskPriority`: LOW | MEDIUM | HIGH | URGENT
- `InvoiceStatus`: DRAFT | SENT | VIEWED | PARTIAL | PAID | OVERDUE | CANCELLED
- `ClientStatus`: LEAD | ACTIVE | VIP | INACTIVE | ARCHIVED
- `AutomationTrigger`: PROJECT_CREATED | TASK_COMPLETED | INVOICE_PAID | DEADLINE_APPROACHING | ...
- `AutomationAction`: SEND_EMAIL | CREATE_TASK | UPDATE_STATUS | SEND_NOTIFICATION | WEBHOOK

---

## Design System

- **Background palette:** `hunter.*` — dark navy/charcoal (#050508 → #1a1f2e)
- **Accent:** `gold.*` — amber/gold tones
- **Neon:** `neon.*` — blue, indigo, violet, cyan, green
- **Shadows:** `glow-sm`, `glow`, `glow-lg`, `glow-gold`, `card-hunter`
- **Animations:** `fade-in`, `fade-in-left`, `shimmer`, `border-flow`
- **Fonts:** Geist Sans (UI) + Geist Mono (code)
- **Theme:** Dark mode only, cinematic, futuristic

---

## Modules & Trạng thái

### Đã hoàn thành (scaffold + UI)
| Module | Route | Status |
|--------|-------|--------|
| Dashboard Overview | `/dashboard` | UI shell + stats/charts components |
| Projects | `/dashboard/projects` | Card list UI, header |
| Clients CRM | `/dashboard/clients` | Card list UI, header |
| Tasks (Kanban) | `/dashboard/tasks` | KanbanBoard, TaskCard |
| Production Pipeline | `/dashboard/pipeline` | PipelineStage component |
| Finance | `/dashboard/finance` | FinanceStats component |
| Quotes & Invoices | `/dashboard/invoices` | InvoiceCard component |
| Team Workspace | `/dashboard/team` | MemberCard, TeamHeader |
| AI Assistant | `/dashboard/ai` | ChatMessage, ChatInput, API route |
| Automation | `/dashboard/automation` | AutomationCard, rule list |

### Đã có cơ sở hạ tầng
- Prisma schema đầy đủ 13+ models
- Server actions scaffolded cho tất cả modules
- TypeScript types đầy đủ
- Clerk auth + middleware hoạt động
- Anthropic AI streaming endpoint (`/api/ai/chat`)
- Utility functions (formatCurrency, formatDate, cn, etc.)
- Custom Tailwind design tokens

---

## Còn lại (TODO)

### Ưu tiên cao — Data Layer
- [ ] Kết nối Supabase: chạy `prisma db push` + seed data
- [ ] Implement thực tế server actions (hiện tại là scaffolded/empty)
- [ ] Wire data vào từng page component (thay UI shell bằng real data)

### Ưu tiên cao — UI hoàn thiện
- [ ] Form modals: Create/Edit cho Projects, Clients, Tasks, Invoices
- [ ] Detail pages: `/dashboard/projects/[id]`, `/dashboard/clients/[id]`
- [ ] Search + filter cho Projects, Clients, Tasks
- [ ] Loading states (Skeleton) + Error boundaries
- [ ] Asset Library module (`/dashboard/assets`) — route chưa tồn tại

### Ưu tiên trung — Features
- [ ] `src/hooks/` — custom hooks (use-projects, use-clients, use-tasks...)
- [ ] `src/store/` — Zustand stores
- [ ] File upload (Uploadthing) — cho Asset Library và Renders
- [ ] Email integration (Resend) — invoice gửi email, notifications
- [ ] Automation engine — thực thi AutomationRun khi trigger xảy ra
- [ ] AI context: feed project data vào Claude để trả lời thông minh hơn

### Ưu tiên thấp — Polish
- [ ] Responsive mobile layout
- [ ] Notifications panel
- [ ] Dark/light theme toggle (hiện tại dark only)
- [ ] Prisma seed script (`prisma/seed.ts`)
- [ ] Webhook handlers (`/api/webhooks/clerk`, `/api/webhooks/stripe`)

---

## Conventions

- **Components:** `src/components/<module>/ComponentName.tsx`
- **Pages:** `src/app/(dashboard)/<module>/page.tsx`
- **Types:** `src/types/<module>.ts`
- **Hooks:** `src/hooks/use-<name>.ts`
- **Server actions:** `src/actions/<module>.ts` — always `"use server"` at top
- **Path alias:** `@/*` → `src/*`

## Rules

- No comments in code unless critical
- No mock data unless asked
- No explanations, just code
- One module per session
- Server actions dùng Prisma (không fetch trực tiếp từ component)
- Zod validation ở tất cả form inputs và API boundaries
