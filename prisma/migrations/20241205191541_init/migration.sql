-- CreateEnum
CREATE TYPE "Level" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "CaseCategory" AS ENUM ('Politicians', 'Political_Activists', 'Social_Workers', 'Social_Media_User', 'Foreigner', 'Others');

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" "CaseCategory" NOT NULL,
    "level" "Level" NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case_Timeline" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attach_files" TEXT[],
    "deadline" TIMESTAMP(3) NOT NULL,
    "comments" TEXT NOT NULL,
    "referred_by" INTEGER,
    "referred_to" INTEGER,
    "collab_id" INTEGER,
    "description" TEXT NOT NULL,

    CONSTRAINT "Case_Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collab" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "moderator" INTEGER NOT NULL,

    CONSTRAINT "Collab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "collab_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "attach_file" TEXT NOT NULL,
    "collabId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_History" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "User_History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollabUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CollabUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollabUsers_B_index" ON "_CollabUsers"("B");

-- AddForeignKey
ALTER TABLE "Case_Timeline" ADD CONSTRAINT "Case_Timeline_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case_Timeline" ADD CONSTRAINT "Case_Timeline_referred_to_fkey" FOREIGN KEY ("referred_to") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case_Timeline" ADD CONSTRAINT "Case_Timeline_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collab" ADD CONSTRAINT "Collab_moderator_fkey" FOREIGN KEY ("moderator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "Collab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_History" ADD CONSTRAINT "User_History_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_History" ADD CONSTRAINT "User_History_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollabUsers" ADD CONSTRAINT "_CollabUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Collab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollabUsers" ADD CONSTRAINT "_CollabUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
