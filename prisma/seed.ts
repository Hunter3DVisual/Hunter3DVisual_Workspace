import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.chatMessage.deleteMany();
  await db.chatSession.deleteMany();
  await db.automationRun.deleteMany();
  await db.automation.deleteMany();
  await db.notification.deleteMany();
  await db.comment.deleteMany();
  await db.teamMember.deleteMany();
  await db.render.deleteMany();
  await db.asset.deleteMany();
  await db.task.deleteMany();
  await db.pipelineStage.deleteMany();
  await db.invoice.deleteMany();
  await db.quote.deleteMany();
  await db.project.deleteMany();
  await db.contact.deleteMany();
  await db.client.deleteMany();
  await db.user.deleteMany();

  const [user] = await Promise.all([
    db.user.create({
      data: {
        clerkId: "user_seed_owner",
        email: "hunter@hunter3dvisual.com",
        name: "Hunter Luu",
        role: "owner",
      },
    }),
    db.user.create({
      data: {
        clerkId: "user_seed_3d_artist",
        email: "minh@hunter3dvisual.com",
        name: "Minh Tran",
        role: "artist",
      },
    }),
    db.user.create({
      data: {
        clerkId: "user_seed_lead_artist",
        email: "an@hunter3dvisual.com",
        name: "An Pham",
        role: "lead",
      },
    }),
    db.user.create({
      data: {
        clerkId: "user_seed_compositor",
        email: "duc@hunter3dvisual.com",
        name: "Duc Le",
        role: "compositor",
      },
    }),
  ]);

  const [meridian, urbancore, bespoke, pacific, marco] = await Promise.all([
    db.client.create({
      data: {
        name: "Alex Nguyen",
        company: "Meridian Properties",
        email: "alex@meridianprops.com",
        phone: "+84 90 123 4567",
        status: "VIP",
        country: "Vietnam",
        city: "Ho Chi Minh City",
        tags: ["real-estate", "vip"],
      },
    }),
    db.client.create({
      data: {
        name: "Sarah Chen",
        company: "UrbanCore Dev",
        email: "sarah@urbancore.io",
        phone: "+1 415 555 0123",
        status: "ACTIVE",
        country: "USA",
        city: "San Francisco",
        tags: ["developer", "commercial"],
      },
    }),
    db.client.create({
      data: {
        name: "James Harrington",
        company: "Bespoke Estates",
        email: "james@bespokeestates.co.uk",
        phone: "+44 20 7946 0123",
        status: "ACTIVE",
        country: "UK",
        city: "London",
        tags: ["luxury", "residential"],
      },
    }),
    db.client.create({
      data: {
        name: "Linh Tran",
        company: "Pacific Living Group",
        email: "linh@pacificliving.vn",
        phone: "+84 91 234 5678",
        status: "ACTIVE",
        country: "Vietnam",
        city: "Hanoi",
        tags: ["residential", "highrise"],
      },
    }),
    db.client.create({
      data: {
        name: "Marco Rossi",
        email: "marco.rossi@gmail.com",
        phone: "+39 02 1234 5678",
        status: "LEAD",
        country: "Italy",
        city: "Milan",
        tags: ["interior", "residential"],
      },
    }),
  ]);

  const now = new Date();
  const ago = (days: number) => new Date(now.getTime() - days * 86400000);
  const from = (days: number) => new Date(now.getTime() + days * 86400000);

  const [villa, skyline, manor, horizon, milan, delivered] = await Promise.all([
    db.project.create({
      data: {
        code: "VLT-001",
        name: "Villa Lumina — Interior CGI",
        description: "Full interior visualization, 12 hero shots + walkthrough animation.",
        status: "RENDERING",
        clientId: meridian.id,
        ownerId: user.id,
        progress: 78,
        budget: 8500,
        currency: "USD",
        startDate: ago(45),
        deadline: from(19),
        tags: ["interior", "villa", "animation"],
      },
    }),
    db.project.create({
      data: {
        code: "SKY-002",
        name: "Skyline Tower — Exterior",
        description: "High-rise commercial tower, 8 exterior angles, sunset + daytime.",
        status: "MODELING",
        clientId: urbancore.id,
        ownerId: user.id,
        progress: 42,
        budget: 6000,
        currency: "USD",
        startDate: ago(20),
        deadline: from(40),
        tags: ["exterior", "highrise", "commercial"],
      },
    }),
    db.project.create({
      data: {
        code: "MNR-003",
        name: "Manor House — Full CGI Package",
        description: "Luxury manor, 6 exterior + 8 interior shots, full material library.",
        status: "POST",
        clientId: bespoke.id,
        ownerId: user.id,
        progress: 91,
        budget: 12000,
        currency: "GBP",
        startDate: ago(60),
        deadline: from(8),
        tags: ["luxury", "exterior", "interior"],
      },
    }),
    db.project.create({
      data: {
        code: "HRZ-004",
        name: "Horizon Residences — Animation",
        description: "60-second fly-through animation + 4 hero stills for marketing.",
        status: "LIGHTING",
        clientId: pacific.id,
        ownerId: user.id,
        progress: 55,
        budget: 15000,
        currency: "USD",
        startDate: ago(30),
        deadline: from(85),
        tags: ["animation", "residential", "highrise"],
      },
    }),
    db.project.create({
      data: {
        code: "MLN-005",
        name: "Milan Penthouse — Concept",
        description: "Concept visualization for luxury penthouse in Milan.",
        status: "CONCEPT",
        clientId: marco.id,
        ownerId: user.id,
        progress: 18,
        budget: 4500,
        currency: "EUR",
        startDate: ago(7),
        deadline: from(55),
        tags: ["interior", "penthouse", "concept"],
      },
    }),
    db.project.create({
      data: {
        code: "CLF-000",
        name: "Cliffside Villa — Delivered",
        description: "Complete exterior + interior CGI package.",
        status: "DELIVERED",
        clientId: meridian.id,
        ownerId: user.id,
        progress: 100,
        budget: 9500,
        currency: "USD",
        startDate: ago(90),
        deadline: ago(15),
        deliveredAt: ago(18),
        tags: ["delivered", "exterior", "interior"],
      },
    }),
  ]);

  const taskData = [
    { title: "Set up scene lighting rigs", projectId: villa.id, status: "DONE", priority: "HIGH", assigneeId: user.id },
    { title: "Material library — fabric textures", projectId: villa.id, status: "DONE", priority: "MEDIUM", assigneeId: user.id },
    { title: "Render kitchen hero shot", projectId: villa.id, status: "IN_PROGRESS", priority: "URGENT", assigneeId: user.id },
    { title: "Render living room 3 angles", projectId: villa.id, status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Post-processing — color grade", projectId: villa.id, status: "TODO", priority: "HIGH" },
    { title: "Client walkthrough export", projectId: villa.id, status: "TODO", priority: "MEDIUM" },
    { title: "Base model — tower structure", projectId: skyline.id, status: "DONE", priority: "HIGH", assigneeId: user.id },
    { title: "Facade detailing — glass panels", projectId: skyline.id, status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Landscape + street level", projectId: skyline.id, status: "TODO", priority: "MEDIUM" },
    { title: "HDRI lighting test", projectId: skyline.id, status: "TODO", priority: "LOW" },
    { title: "Final render pass — exterior", projectId: manor.id, status: "IN_PROGRESS", priority: "URGENT", assigneeId: user.id },
    { title: "Photoshop comp — sky replacement", projectId: manor.id, status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Export delivery package", projectId: manor.id, status: "TODO", priority: "URGENT" },
    { title: "Animation blocking approved", projectId: horizon.id, status: "DONE", priority: "HIGH", assigneeId: user.id },
    { title: "Set up camera paths", projectId: horizon.id, status: "DONE", priority: "MEDIUM" },
    { title: "HDRI + sun position fine-tune", projectId: horizon.id, status: "IN_PROGRESS", priority: "HIGH" },
    { title: "Vegetation system", projectId: horizon.id, status: "TODO", priority: "MEDIUM" },
    { title: "Brief review + style board", projectId: milan.id, status: "DONE", priority: "MEDIUM", assigneeId: user.id },
    { title: "Rough blockout models", projectId: milan.id, status: "IN_PROGRESS", priority: "MEDIUM" },
  ];

  for (const t of taskData) {
    await db.task.create({ data: t as any });
  }

  const monthAgo = (n: number, day = 1) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - n);
    d.setDate(day);
    return d;
  };

  await Promise.all([
    db.invoice.create({
      data: {
        number: "INV-2025-001",
        clientId: meridian.id,
        projectId: delivered.id,
        status: "PAID",
        issueDate: monthAgo(5),
        dueDate: monthAgo(4, 15),
        paidAt: monthAgo(4, 10),
        subtotal: 9500,
        tax: 950,
        discount: 0,
        total: 10450,
        currency: "USD",
        items: [{ description: "Cliffside Villa CGI Package", quantity: 1, unitPrice: 9500, total: 9500 }],
      },
    }),
    db.invoice.create({
      data: {
        number: "INV-2025-002",
        clientId: bespoke.id,
        projectId: manor.id,
        status: "PAID",
        issueDate: monthAgo(4),
        dueDate: monthAgo(3, 15),
        paidAt: monthAgo(3, 8),
        subtotal: 6000,
        tax: 0,
        discount: 0,
        total: 6000,
        currency: "GBP",
        items: [{ description: "Manor House — 50% milestone", quantity: 1, unitPrice: 6000, total: 6000 }],
      },
    }),
    db.invoice.create({
      data: {
        number: "INV-2025-003",
        clientId: meridian.id,
        projectId: villa.id,
        status: "PAID",
        issueDate: monthAgo(3),
        dueDate: monthAgo(2, 20),
        paidAt: monthAgo(2, 18),
        subtotal: 4250,
        tax: 425,
        discount: 0,
        total: 4675,
        currency: "USD",
        items: [{ description: "Villa Lumina — 50% deposit", quantity: 1, unitPrice: 4250, total: 4250 }],
      },
    }),
    db.invoice.create({
      data: {
        number: "INV-2025-004",
        clientId: urbancore.id,
        projectId: skyline.id,
        status: "PAID",
        issueDate: monthAgo(2),
        dueDate: monthAgo(1, 15),
        paidAt: monthAgo(1, 12),
        subtotal: 3000,
        tax: 300,
        discount: 0,
        total: 3300,
        currency: "USD",
        items: [{ description: "Skyline Tower — Deposit", quantity: 1, unitPrice: 3000, total: 3000 }],
      },
    }),
    db.invoice.create({
      data: {
        number: "INV-2025-005",
        clientId: pacific.id,
        projectId: horizon.id,
        status: "SENT",
        issueDate: monthAgo(1),
        dueDate: monthAgo(0, 20),
        subtotal: 7500,
        tax: 750,
        discount: 0,
        total: 8250,
        currency: "USD",
        items: [{ description: "Horizon Residences — 50% milestone", quantity: 1, unitPrice: 7500, total: 7500 }],
      },
    }),
    db.invoice.create({
      data: {
        number: "INV-2026-001",
        clientId: bespoke.id,
        projectId: manor.id,
        status: "OVERDUE",
        issueDate: monthAgo(1, 15),
        dueDate: monthAgo(0, 5),
        subtotal: 6000,
        tax: 0,
        discount: 0,
        total: 6000,
        currency: "GBP",
        items: [{ description: "Manor House — Final payment", quantity: 1, unitPrice: 6000, total: 6000 }],
      },
    }),
    db.invoice.create({
      data: {
        number: "INV-2026-002",
        clientId: marco.id,
        projectId: milan.id,
        status: "DRAFT",
        issueDate: now,
        dueDate: from(30),
        subtotal: 2250,
        tax: 0,
        discount: 0,
        total: 2250,
        currency: "EUR",
        items: [{ description: "Milan Penthouse — Concept deposit", quantity: 1, unitPrice: 2250, total: 2250 }],
      },
    }),
    db.automation.create({
      data: {
        name: "Welcome Email on Project Created",
        description: "Sends a welcome email to the client when a new project is created.",
        trigger: "PROJECT_CREATED",
        action: "SEND_EMAIL",
        isActive: true,
        runCount: 6,
        lastRunAt: ago(2),
        payload: { template: "project-welcome", cc: "hunter@hunter3dvisual.com" },
      },
    }),
    db.automation.create({
      data: {
        name: "Deadline Reminder — 7 days",
        description: "Notifies the team 7 days before project deadline.",
        trigger: "DEADLINE_APPROACHING",
        action: "SEND_NOTIFICATION",
        isActive: true,
        runCount: 12,
        lastRunAt: ago(7),
        conditions: { daysBeforeDeadline: 7 },
      },
    }),
    db.automation.create({
      data: {
        name: "Invoice Paid — Update Project Status",
        description: "Moves project to DELIVERED when final invoice is paid.",
        trigger: "INVOICE_PAID",
        action: "UPDATE_STATUS",
        isActive: false,
        runCount: 3,
        payload: { targetStatus: "DELIVERED" },
      },
    }),
  ]);

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
