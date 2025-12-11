/*
  Warnings:

  - You are about to drop the `emotiondiary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `emotiondiary` DROP FOREIGN KEY `EmotionDiary_userId_fkey`;

-- DropTable
DROP TABLE `emotiondiary`;

-- CreateTable
CREATE TABLE `emotion_diaries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `note` TEXT NULL,
    `mood` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emotion_diaries` ADD CONSTRAINT `emotion_diaries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
