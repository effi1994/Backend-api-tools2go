-- CreateTable
CREATE TABLE `ImageGetProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileName` TEXT NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageGetProduct` ADD CONSTRAINT `ImageGetProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
