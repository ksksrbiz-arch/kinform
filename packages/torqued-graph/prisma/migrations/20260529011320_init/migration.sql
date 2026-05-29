-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releasedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "physicalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "dropId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AffiliateProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'SEED',
    "payoutConfig" TEXT,
    "defaultShareBps" INTEGER NOT NULL DEFAULT 1000,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TorquedAffiliation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "shareBps" INTEGER,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "startsAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TorquedAffiliation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TorquedAffiliation_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliateProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RevenueEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL DEFAULT 0,
    "payoutCents" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "productId" TEXT NOT NULL,
    "affiliateId" TEXT,
    "affiliationId" TEXT,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RevenueEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RevenueEvent_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliateProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RevenueEvent_affiliationId_fkey" FOREIGN KEY ("affiliationId") REFERENCES "TorquedAffiliation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "dropId" TEXT,
    "content" TEXT NOT NULL,
    "ctas" TEXT NOT NULL,
    "hashtags" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'instagram',
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "publishedAt" DATETIME,
    "rejectedReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Campaign_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ValidationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "details" TEXT NOT NULL,
    "actor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ValidationLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Drop_slug_key" ON "Drop"("slug");

-- CreateIndex
CREATE INDEX "Drop_status_idx" ON "Drop"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_physicalId_key" ON "Product"("physicalId");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_dropId_idx" ON "Product"("dropId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateProfile_handle_key" ON "AffiliateProfile"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateProfile_email_key" ON "AffiliateProfile"("email");

-- CreateIndex
CREATE INDEX "AffiliateProfile_tier_idx" ON "AffiliateProfile"("tier");

-- CreateIndex
CREATE INDEX "TorquedAffiliation_productId_idx" ON "TorquedAffiliation"("productId");

-- CreateIndex
CREATE INDEX "TorquedAffiliation_affiliateId_idx" ON "TorquedAffiliation"("affiliateId");

-- CreateIndex
CREATE UNIQUE INDEX "TorquedAffiliation_productId_affiliateId_startsAt_key" ON "TorquedAffiliation"("productId", "affiliateId", "startsAt");

-- CreateIndex
CREATE INDEX "RevenueEvent_productId_occurredAt_idx" ON "RevenueEvent"("productId", "occurredAt");

-- CreateIndex
CREATE INDEX "RevenueEvent_affiliateId_occurredAt_idx" ON "RevenueEvent"("affiliateId", "occurredAt");

-- CreateIndex
CREATE INDEX "RevenueEvent_kind_idx" ON "RevenueEvent"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_dropId_idx" ON "Campaign"("dropId");

-- CreateIndex
CREATE INDEX "ValidationLog_campaignId_createdAt_idx" ON "ValidationLog"("campaignId", "createdAt");

-- CreateIndex
CREATE INDEX "ValidationLog_agent_idx" ON "ValidationLog"("agent");

-- CreateIndex
CREATE INDEX "ValidationLog_verdict_idx" ON "ValidationLog"("verdict");
