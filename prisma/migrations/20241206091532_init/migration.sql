/*
  Warnings:

  - You are about to drop the column `comments` on the `Case_Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Case_Timeline` table. All the data in the column will be lost.
  - Added the required column `remarks` to the `Case_Timeline` table without a default value. This is not possible if the table is not empty.
  - Made the column `collab_id` on table `Case_Timeline` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Case_Timeline" DROP COLUMN "comments",
DROP COLUMN "description",
ADD COLUMN     "remarks" TEXT NOT NULL,
ALTER COLUMN "collab_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Case_Timeline" ADD CONSTRAINT "Case_Timeline_collab_id_fkey" FOREIGN KEY ("collab_id") REFERENCES "Collab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
