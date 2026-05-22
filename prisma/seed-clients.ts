import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const clients = [
  {
    clientId: "C-001",
    name: "Alexandre Verbeeck",
    company: "CREALYS LTD",
    email: "alexandre@crealys.mu",
    whatsapp: "+230 5943 5849",
    website: "https://www.crealys.mu/",
    status: "ACTIVE" as const,
    country: "Mauritius",
    address: "206, The Park, Chemin Vingt Pieds, Grand Baie 30513, Mauritius",
    firstContact: new Date("2025-03-18"),
    representative: "Alexandre Verbeeck",
    position: "Managing Director",
    taxCode: "C09090023",
    lastProject: "Nordic Villa Exterior",
    tags: ["active"],
  },
  {
    clientId: "C-002",
    name: "Daniel Blatchford",
    company: "BLATCHFORD DAHL MEDIA INC (BDM3D)",
    email: "admin@bdm3d.com",
    whatsapp: "+250-514-6774",
    website: "https://www.bdm3d.com/",
    status: "ACTIVE" as const,
    country: "Canada",
    address: "3950 Rainbow Street Victoria, BC V8X 2A4, Canada",
    firstContact: new Date("2025-07-18"),
    representative: "Daniel Blatchford",
    position: "Director",
    taxCode: "742020886",
    lastProject: "Dubai Apartment Walkthrough",
    tags: ["active"],
  },
  {
    clientId: "C-003",
    name: "Katja Khandroo",
    company: "KHANDROO DESIGNS",
    email: "khandroo.designs@gmail.com",
    whatsapp: "+1 (714) 317-0743",
    website: "https://khandroodesigns.com/",
    status: "LEAD" as const,
    country: "United States",
    address: "32325 Coast Hwy #201, Laguna Beach, CA 92651",
    firstContact: new Date("2026-01-16"),
    representative: "Katja Khandroo",
    position: "Managing Director",
    taxCode: "EIN: 83-4309677",
    lastProject: "Toronto Kitchen CGI",
    tags: ["new"],
  },
  {
    clientId: "C-004",
    name: "Pawel Szaryk",
    company: "SHAPESHIFTER DIGITAL ANIMATION INC",
    email: "pawel.szaryk@shapeshifter.ca",
    whatsapp: "+1 613 627 3040",
    website: "https://shapeshifter.ca/",
    status: "LEAD" as const,
    country: "Canada",
    address: "116 Albert St. Suite 300, Ottawa, Ontario, K1P5G3",
    firstContact: new Date("2026-01-06"),
    representative: "Pawel Szaryk",
    position: "Managing Director",
    taxCode: "BN: 834038200",
    lastProject: "London Retail Concept",
    tags: ["new"],
  },
];

async function main() {
  for (const data of clients) {
    const client = await db.client.upsert({
      where: { clientId: data.clientId },
      update: data,
      create: data,
    });
    console.log(`✓ ${client.clientId}  ${client.name}  (${client.company})`);
  }
  console.log("\nSeed complete — 4 clients upserted.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
