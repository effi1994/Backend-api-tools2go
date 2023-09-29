/*
  Warnings:

  - Added the required column `userId` to the `ImageGetProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `messages_productId_fkey` ON `messages`;

-- AlterTable
ALTER TABLE `imagegetproduct` ADD COLUMN `isBefore` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userId` INTEGER NOT NULL;
