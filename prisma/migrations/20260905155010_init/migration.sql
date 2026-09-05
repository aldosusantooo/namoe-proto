-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PAKAIAN_IBU_ANAK', 'AKSESORI_ANAK', 'PERLENGKAPAN_RUMAH', 'DEKORASI_RUMAH', 'MAINAN_HOBI', 'ELEKTRONIK', 'PERLENGKAPAN_IBU', 'PERALATAN_DAPUR', 'EDUKASI', 'MAKANAN_MINUMAN');

-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('A', 'FNB');

-- CreateEnum
CREATE TYPE "QuestionKind" AS ENUM ('QUESTION', 'THANKS');

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "startsOn" TIMESTAMP(3) NOT NULL,
    "endsOn" TIMESTAMP(3) NOT NULL,
    "passportTarget" INTEGER NOT NULL DEFAULT 5,
    "prizeCopy" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "intro" TEXT NOT NULL,
    "promo" TEXT,
    "photos" TEXT[],
    "logoUrl" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "marketplace" TEXT,
    "color" TEXT,
    "editToken" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantSlot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "time" TEXT,
    "day" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TenantSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booth" (
    "code" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "band" INTEGER NOT NULL,
    "cluster" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL,
    "qrToken" TEXT NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "Booth_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "day" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'Panggung utama',

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionSpeaker" (
    "sessionId" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,

    CONSTRAINT "SessionSpeaker_pkey" PRIMARY KEY ("sessionId","speakerId")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "kind" "QuestionKind" NOT NULL DEFAULT 'QUESTION',
    "body" TEXT NOT NULL,
    "displayName" TEXT,
    "deviceId" TEXT NOT NULL,
    "upvoteCount" INTEGER NOT NULL DEFAULT 0,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3),
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "questionId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("questionId","deviceId")
);

-- CreateTable
CREATE TABLE "TenantPost" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "displayName" TEXT,
    "deviceId" TEXT NOT NULL,
    "reply" TEXT,
    "repliedAt" TIMESTAMP(3),
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedPost" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "photoUrl" TEXT,
    "authorTenantId" TEXT,
    "displayName" TEXT,
    "deviceId" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passport" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "redeemCode" TEXT,
    "completedAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stamp" (
    "passportId" TEXT NOT NULL,
    "boothCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stamp_pkey" PRIMARY KEY ("passportId","boothCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_editToken_key" ON "Tenant"("editToken");

-- CreateIndex
CREATE UNIQUE INDEX "Booth_qrToken_key" ON "Booth"("qrToken");

-- CreateIndex
CREATE UNIQUE INDEX "Speaker_slug_key" ON "Speaker"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Session_slug_key" ON "Session"("slug");

-- CreateIndex
CREATE INDEX "Question_sessionId_kind_hidden_idx" ON "Question"("sessionId", "kind", "hidden");

-- CreateIndex
CREATE UNIQUE INDEX "Passport_deviceId_key" ON "Passport"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Passport_redeemCode_key" ON "Passport"("redeemCode");

-- AddForeignKey
ALTER TABLE "TenantSlot" ADD CONSTRAINT "TenantSlot_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booth" ADD CONSTRAINT "Booth_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSpeaker" ADD CONSTRAINT "SessionSpeaker_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSpeaker" ADD CONSTRAINT "SessionSpeaker_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantPost" ADD CONSTRAINT "TenantPost_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedPost" ADD CONSTRAINT "FeedPost_authorTenantId_fkey" FOREIGN KEY ("authorTenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "Passport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_boothCode_fkey" FOREIGN KEY ("boothCode") REFERENCES "Booth"("code") ON DELETE CASCADE ON UPDATE CASCADE;
