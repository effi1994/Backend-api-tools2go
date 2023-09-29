-- CreateTable
CREATE TABLE `BankMiddeleware` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `money` DOUBLE NOT NULL,
    `CreditCardId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankMoney` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `money` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankMiddeleware` ADD CONSTRAINT `BankMiddeleware_CreditCardId_fkey` FOREIGN KEY (`CreditCardId`) REFERENCES `CreditCard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankMoney` ADD CONSTRAINT `BankMoney_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
