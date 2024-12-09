/*
  Warnings:

  - You are about to drop the column `userId` on the `Case` table. All the data in the column will be lost.
  - Added the required column `moderator_id` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_userId_fkey";

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "userId",
ADD COLUMN     "moderator_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_moderator_id_fkey" FOREIGN KEY ("moderator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
