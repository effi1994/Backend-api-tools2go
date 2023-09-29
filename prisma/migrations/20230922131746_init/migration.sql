/*
  Warnings:

  - You are about to drop the column `receiverId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `messages` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_senderId_fkey`;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `receiverId`,
    DROP COLUMN `senderId`,
    DROP COLUMN `title`,
    ADD COLUMN `fromUserId` INTEGER NOT NULL,
    ADD COLUMN `toUserId` INTEGER NOT NULL;
