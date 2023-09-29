/*
  Warnings:

  - You are about to alter the column `expiryDate` on the `creditcard` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `creditcard` MODIFY `expiryDate` ENUM('BASIC', 'PREMIUM', 'BUSINESS') NOT NULL;
