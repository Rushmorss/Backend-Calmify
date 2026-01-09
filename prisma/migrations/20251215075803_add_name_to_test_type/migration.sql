/*
  Warnings:

  - You are about to alter the column `proj_name` on the `dispsysprojs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `proj_dir` on the `dispsysprojs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `proj_version` on the `dispsysprojs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `emotion_diaries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `emotion_diaries` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `emotion_diaries` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `emotion_diaries` table. All the data in the column will be lost.
  - You are about to drop the `assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testscale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usersetting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `diaryDate` to the `emotion_diaries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `emotion_diaries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `emotion_diaries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assessment` DROP FOREIGN KEY `Assessment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `emotion_diaries` DROP FOREIGN KEY `emotion_diaries_userId_fkey`;

-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `Question_testCode_fkey`;

-- DropForeignKey
ALTER TABLE `testscale` DROP FOREIGN KEY `TestScale_testCode_fkey`;

-- DropForeignKey
ALTER TABLE `usersetting` DROP FOREIGN KEY `UserSetting_userId_fkey`;

-- AlterTable
ALTER TABLE `dispsysprojs` MODIFY `proj_name` VARCHAR(191) NULL,
    MODIFY `proj_dir` VARCHAR(191) NULL,
    MODIFY `proj_version` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `emotion_diaries` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `mood`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `diaryDate` DATE NOT NULL,
    ADD COLUMN `icon_id` VARCHAR(191) NULL,
    ADD COLUMN `icon_url` VARCHAR(191) NULL,
    ADD COLUMN `moodScore` INTEGER NULL DEFAULT 0,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `assessment`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `exercise`;

-- DropTable
DROP TABLE `question`;

-- DropTable
DROP TABLE `testscale`;

-- DropTable
DROP TABLE `testtype`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `usersetting`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(50) NULL,
    `avatar_url` VARCHAR(500) NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(20) NULL,
    `job` VARCHAR(255) NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `otp` VARCHAR(20) NULL,
    `otpExpiry` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emotion_icons` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(255) NULL,
    `default_score` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `test_types_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_scales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testCode` VARCHAR(50) NOT NULL,
    `label` VARCHAR(255) NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `test_scales_testCode_value_key`(`testCode`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `questionOrder` INTEGER NOT NULL,
    `testCode` VARCHAR(50) NOT NULL,
    `category` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `testTypeCode` VARCHAR(50) NOT NULL,
    `finalScore` INTEGER NULL,
    `resultDetail` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `sessionSummary` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` INTEGER NOT NULL,
    `sender` ENUM('USER', 'AI', 'SYSTEM') NOT NULL,
    `content` TEXT NOT NULL,
    `messageType` ENUM('TEXT', 'IMAGE', 'AUDIO', 'SYSTEM') NOT NULL DEFAULT 'TEXT',
    `tokensUsed` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `instruction` TEXT NULL,
    `videoUrl` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `support_types_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `typeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emotion_diaries` ADD CONSTRAINT `emotion_diaries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emotion_diaries` ADD CONSTRAINT `emotion_diaries_icon_id_fkey` FOREIGN KEY (`icon_id`) REFERENCES `emotion_icons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_scales` ADD CONSTRAINT `test_scales_testCode_fkey` FOREIGN KEY (`testCode`) REFERENCES `test_types`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_testCode_fkey` FOREIGN KEY (`testCode`) REFERENCES `test_types`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_testTypeCode_fkey` FOREIGN KEY (`testTypeCode`) REFERENCES `test_types`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `exercise_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_locations` ADD CONSTRAINT `support_locations_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `support_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
