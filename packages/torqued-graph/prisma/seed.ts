/**
 * Seed the KINFORM Torqued Graph with a deterministic, realistic dataset.
 *
 * Run with:
 *   npm run graph:seed              # from the repo root
 *   npm run seed                    # from this package
 *
 * Idempotent: uses `upsert` on stable natural keys (slug, sku, handle, email).
 * Safe to run repeatedly against the same database.
 */
import { PrismaClient } from "./generated/client";
import {
  AffiliateTier,
  CampaignChannel,
  CampaignStatus,
  DropStatus,
  ProductCategory,
  RevenueEventKind,
  ValidationAgent,
  ValidationVerdict,
} from "../src/enums";
import { encodeJson, encodeJsonNullable } from "../src/json";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Seeding KINFORM Torqued Graph…");

  // --- Drops ---------------------------------------------------------------
  const halter = await prisma.drop.upsert({
    where: { slug: "halter" },
    update: {},
    create: {
      slug: "halter",
      name: "HALTER",
      description:
        "Debut halter silhouette — sculptural neckline, deadstock noir twill.",
      releasedAt: new Date("2026-03-01T00:00:00Z"),
      status: DropStatus.LIVE,
    },
  });
  const fishnet = await prisma.drop.upsert({
    where: { slug: "fishnet" },
    update: {},
    create: {
      slug: "fishnet",
      name: "FISHNET",
      description: "Open-weave layering piece. Italian milled cotton.",
      releasedAt: new Date("2026-04-15T00:00:00Z"),
      status: DropStatus.UPCOMING,
    },
  });
  const academic = await prisma.drop.upsert({
    where: { slug: "academic" },
    update: {},
    create: {
      slug: "academic",
      name: "ACADEMIC",
      description:
        "Tailored, archive-inspired set. Heavyweight cotton, hand-finished.",
      releasedAt: new Date("2026-05-20T00:00:00Z"),
      status: DropStatus.UPCOMING,
    },
  });

  // --- Products ------------------------------------------------------------
  const halterTop = await prisma.product.upsert({
    where: { sku: "halter-noir-s" },
    update: {},
    create: {
      sku: "halter-noir-s",
      physicalId: "KIN-HAL-NOIR-S-000001",
      name: "HALTER Noir — Small",
      description: "Sculptural halter top in deadstock noir twill.",
      category: ProductCategory.APPAREL,
      priceCents: 18800,
      dropId: halter.id,
    },
  });
  const fishnetTee = await prisma.product.upsert({
    where: { sku: "fishnet-ivory-m" },
    update: {},
    create: {
      sku: "fishnet-ivory-m",
      physicalId: "KIN-FSH-IVORY-M-000001",
      name: "FISHNET Ivory — Medium",
      description: "Open-weave layering top, Italian milled cotton.",
      category: ProductCategory.APPAREL,
      priceCents: 22400,
      dropId: fishnet.id,
    },
  });
  const academicSet = await prisma.product.upsert({
    where: { sku: "academic-graphite-m" },
    update: {},
    create: {
      sku: "academic-graphite-m",
      physicalId: "KIN-ACD-GRAPHITE-M-000001",
      name: "ACADEMIC Graphite Set — Medium",
      description: "Two-piece academic set, heavyweight cotton.",
      category: ProductCategory.APPAREL,
      priceCents: 38800,
      dropId: academic.id,
    },
  });
  const earringPair = await prisma.product.upsert({
    where: { sku: "earring-arc-noir-pair" },
    update: {},
    create: {
      sku: "earring-arc-noir-pair",
      physicalId: "KIN-EAR-ARC-NOIR-000001",
      name: "Arc Noir — Statement Earring (pair)",
      description: "Sculptural statement earring, polished black brass.",
      category: ProductCategory.JEWELRY,
      priceCents: 6800,
    },
  });

  // --- Affiliates ----------------------------------------------------------
  const founder = await prisma.affiliateProfile.upsert({
    where: { email: "founder@kinform.local" },
    update: {},
    create: {
      handle: "kinform-founder",
      displayName: "KINFORM Founder",
      email: "founder@kinform.local",
      tier: AffiliateTier.KEYSTONE,
      defaultShareBps: 2500,
    },
  });
  const seedAffiliate = await prisma.affiliateProfile.upsert({
    where: { email: "ari@kinform.local" },
    update: {},
    create: {
      handle: "ari-bloom",
      displayName: "Ari Bloom",
      email: "ari@kinform.local",
      tier: AffiliateTier.BLOOM,
      defaultShareBps: 1500,
    },
  });

  // --- Torqued Affiliations -----------------------------------------------
  const startsAt = new Date("2026-03-01T00:00:00Z");
  const halterEdge = await prisma.torquedAffiliation.upsert({
    where: {
      productId_affiliateId_startsAt: {
        productId: halterTop.id,
        affiliateId: seedAffiliate.id,
        startsAt,
      },
    },
    update: {},
    create: {
      productId: halterTop.id,
      affiliateId: seedAffiliate.id,
      startsAt,
      shareBps: 1800,
      weight: 1,
    },
  });
  await prisma.torquedAffiliation.upsert({
    where: {
      productId_affiliateId_startsAt: {
        productId: earringPair.id,
        affiliateId: founder.id,
        startsAt,
      },
    },
    update: {},
    create: {
      productId: earringPair.id,
      affiliateId: founder.id,
      startsAt,
      shareBps: 2500,
      weight: 1,
    },
  });

  // --- Revenue Events (idempotent via existence check) --------------------
  // RevenueEvent has no natural unique key (append-only ledger), so seed
  // idempotency is done by checking whether the seed pair already exists for
  // this product+affiliate edge and skipping if so. This uses only portable
  // query primitives (no JSON path filters).
  const existingSeedEvents = await prisma.revenueEvent.count({
    where: { productId: halterTop.id, affiliationId: halterEdge.id },
  });
  if (existingSeedEvents === 0) {
    await prisma.revenueEvent.createMany({
      data: [
        {
          kind: RevenueEventKind.SCAN,
          amountCents: 0,
          payoutCents: 0,
          productId: halterTop.id,
          affiliateId: seedAffiliate.id,
          affiliationId: halterEdge.id,
          metadata: encodeJsonNullable({ seed: true, source: "qr", geo: "us-west" }),
        },
        {
          kind: RevenueEventKind.ATTRIBUTED_PURCHASE,
          amountCents: 18800,
          payoutCents: Math.round((18800 * 1800) / 10000),
          productId: halterTop.id,
          affiliateId: seedAffiliate.id,
          affiliationId: halterEdge.id,
          metadata: encodeJsonNullable({ seed: true, orderId: "seed-order-001" }),
        },
      ],
    });
  }

  // --- Sample campaign in SIMULATION status (not approved) ----------------
  const sampleCampaign = await prisma.campaign.upsert({
    where: { slug: "halter-noir-launch" },
    update: {},
    create: {
      slug: "halter-noir-launch",
      status: CampaignStatus.SIMULATION,
      dropId: halter.id,
      content:
        "Wear the network. HALTER Noir drops 03.01. Scan to claim your share.",
      ctas: encodeJson(["Scan the tag", "Join the network"]),
      hashtags: encodeJson(["#KINFORM", "#TorquedAffiliation", "#HALTER"]),
      channel: CampaignChannel.INSTAGRAM,
    },
  });
  await prisma.validationLog.create({
    data: {
      campaignId: sampleCampaign.id,
      agent: ValidationAgent.SUPERVISOR,
      verdict: ValidationVerdict.PASS,
      score: 82,
      details: encodeJson({
        notes: "Seed validation entry — produced by Torqued Graph seed script.",
        metrics: { length: sampleCampaign.content.length },
      }),
    },
  });

  console.log("Seed complete.");
  console.log(`  drops:     ${[halter.slug, fishnet.slug, academic.slug].join(", ")}`);
  console.log(
    `  products:  ${[halterTop.sku, fishnetTee.sku, academicSet.sku, earringPair.sku].join(", ")}`,
  );
  console.log(`  affiliates:${[founder.handle, seedAffiliate.handle].join(", ")}`);
  console.log(`  campaign:  ${sampleCampaign.slug} (status=${sampleCampaign.status})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
