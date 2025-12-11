/*
  Warnings:

  - You are about to drop the `emotion_diaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `emotion_diaries` DROP FOREIGN KEY `emotion_diaries_userId_fkey`;

-- DropTable
DROP TABLE `emotion_diaries`;

-- CreateTable
CREATE TABLE `EmotionDiary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `notes` TEXT NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `emotion` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EmotionDiary_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmotionDiary` ADD CONSTRAINT `EmotionDiary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
