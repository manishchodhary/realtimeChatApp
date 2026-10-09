/*
  Warnings:

  - A unique constraint covering the columns `[directKey]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `directKey` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "directKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_directKey_key" ON "public"."Conversation"("directKey");
