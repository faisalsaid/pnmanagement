-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('article', 'page', 'category', 'other');

-- CreateTable
CREATE TABLE "PageVisit" (
    "id" BIGSERIAL NOT NULL,
    "visitTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "ip" VARCHAR(45) NOT NULL,
    "city" VARCHAR(80),
    "country" VARCHAR(80),
    "timezone" VARCHAR(40),
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageType" "PageType" NOT NULL,
    "referrer" TEXT,
    "articleId" TEXT,
    "deviceType" VARCHAR(20),
    "os" VARCHAR(40),
    "browser" VARCHAR(40),
    "screen" VARCHAR(20),
    "language" VARCHAR(20),
    "extra" JSONB,

    CONSTRAINT "PageVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageVisit_visitTime_idx" ON "PageVisit"("visitTime" DESC);

-- CreateIndex
CREATE INDEX "PageVisit_articleId_idx" ON "PageVisit"("articleId");

-- CreateIndex
CREATE INDEX "PageVisit_country_idx" ON "PageVisit"("country");

-- CreateIndex
CREATE INDEX "PageVisit_sessionId_idx" ON "PageVisit"("sessionId");

-- AddForeignKey
ALTER TABLE "PageVisit" ADD CONSTRAINT "PageVisit_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageVisit" ADD CONSTRAINT "PageVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
