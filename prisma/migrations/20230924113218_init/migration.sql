/*
  Warnings:

  - Added the required column `actionId` to the `ImageGetProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `imagegetproduct` ADD COLUMN `actionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ImageGetProduct` ADD CONSTRAINT `ImageGetProduct_actionId_fkey` FOREIGN KEY (`actionId`) REFERENCES `productActions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
