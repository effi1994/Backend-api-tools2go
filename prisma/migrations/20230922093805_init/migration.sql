/*
  Warnings:

  - You are about to drop the column `CreditCardId` on the `bankmiddeleware` table. All the data in the column will be lost.
  - Added the required column `creditCardId` to the `BankMiddeleware` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bankmiddeleware` DROP FOREIGN KEY `BankMiddeleware_CreditCardId_fkey`;

-- AlterTable
ALTER TABLE `bankmiddeleware` DROP COLUMN `CreditCardId`,
    ADD COLUMN `creditCardId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `BankMiddeleware` ADD CONSTRAINT `BankMiddeleware_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `CreditCard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
