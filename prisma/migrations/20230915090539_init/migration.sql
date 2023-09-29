/*
  Warnings:

  - You are about to drop the column `image` on the `productimages` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `productImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productimages` DROP COLUMN `image`,
    ADD COLUMN `fileName` TEXT NOT NULL;
