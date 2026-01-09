/*
  Warnings:

  - You are about to drop the column `createdAt` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `finalScore` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `resultDetail` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `testTypeCode` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `assessments` table. All the data in the column will be lost.
  - The primary key for the `chat_messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `messageType` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `tokensUsed` on the `chat_messages` table. All the data in the column will be lost.
  - The primary key for the `chat_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionSummary` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `diaryDate` on the `emotion_diaries` table. All the data in the column will be lost.
  - You are about to drop the column `moodScore` on the `emotion_diaries` table. All the data in the column will be lost.
  - You are about to alter the column `icon_id` on the `emotion_diaries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to drop the column `createdAt` on the `exercise_categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `questionOrder` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `testCode` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `support_locations` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `support_locations` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `support_locations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `support_locations` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `support_types` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `code` on the `support_types` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `testCode` on the `test_scales` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `test_types` table. All the data in the column will be lost.
  - You are about to drop the `dispsysprojs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[test_code,value]` on the table `test_scales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `test_type` to the `assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_id` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `chat_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diary_date` to the `emotion_diaries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_order` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_code` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `support_locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_code` to the `test_scales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assessments` DROP FOREIGN KEY `assessments_testTypeCode_fkey`;

-- DropForeignKey
ALTER TABLE `assessments` DROP FOREIGN KEY `assessments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `chat_sessions` DROP FOREIGN KEY `chat_sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `emotion_diaries` DROP FOREIGN KEY `emotion_diaries_icon_id_fkey`;

-- DropForeignKey
ALTER TABLE `exercises` DROP FOREIGN KEY `exercises_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `questions_testCode_fkey`;

-- DropForeignKey
ALTER TABLE `support_locations` DROP FOREIGN KEY `support_locations_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `test_scales` DROP FOREIGN KEY `test_scales_testCode_fkey`;

-- DropIndex
DROP INDEX `test_scales_testCode_value_key` ON `test_scales`;

-- AlterTable
ALTER TABLE `assessments` DROP COLUMN `createdAt`,
    DROP COLUMN `finalScore`,
    DROP COLUMN `resultDetail`,
    DROP COLUMN `testTypeCode`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `final_score` INTEGER NULL DEFAULT 0,
    ADD COLUMN `result_detail` JSON NULL,
    ADD COLUMN `test_type` VARCHAR(50) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `chat_messages` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `messageType`,
    DROP COLUMN `sessionId`,
    DROP COLUMN `tokensUsed`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `message_type` ENUM('TEXT', 'IMAGE', 'AUDIO', 'SYSTEM') NULL DEFAULT 'TEXT',
    ADD COLUMN `session_id` INTEGER NOT NULL,
    ADD COLUMN `tokens_used` INTEGER NULL DEFAULT 0,
    ADD PRIMARY KEY (`message_id`);

-- AlterTable
ALTER TABLE `chat_sessions` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `id`,
    DROP COLUMN `sessionSummary`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `session_summary` TEXT NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `user_id` INTEGER NOT NULL,
    MODIFY `title` VARCHAR(255) NULL,
    ADD PRIMARY KEY (`session_id`);

-- AlterTable
ALTER TABLE `emotion_diaries` DROP COLUMN `diaryDate`,
    DROP COLUMN `moodScore`,
    ADD COLUMN `diary_date` DATE NOT NULL,
    ADD COLUMN `mood_score` INTEGER NULL DEFAULT 0,
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `icon_id` VARCHAR(36) NULL,
    MODIFY `icon_url` VARCHAR(255) NULL,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `exercise_categories` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `thumbnail` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `exercises` DROP COLUMN `categoryId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `videoUrl`,
    ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `video_url` VARCHAR(500) NOT NULL,
    MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `thumbnail` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `questions` DROP COLUMN `questionOrder`,
    DROP COLUMN `testCode`,
    ADD COLUMN `question_order` INTEGER NOT NULL,
    ADD COLUMN `test_code` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `support_locations` DROP COLUMN `createdAt`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `typeId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `phone_number` VARCHAR(50) NULL,
    ADD COLUMN `type_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `address` VARCHAR(500) NULL,
    MODIFY `note` TEXT NULL;

-- AlterTable
ALTER TABLE `support_types` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `code` VARCHAR(50) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `test_scales` DROP COLUMN `testCode`,
    ADD COLUMN `test_code` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `test_types` DROP COLUMN `name`;

-- AlterTable
ALTER TABLE `users` MODIFY `role` VARCHAR(50) NULL DEFAULT 'user',
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- DropTable
DROP TABLE `dispsysprojs`;

-- CreateIndex
CREATE UNIQUE INDEX `test_scales_test_code_value_key` ON `test_scales`(`test_code`, `value`);

-- AddForeignKey
ALTER TABLE `emotion_diaries` ADD CONSTRAINT `emotion_diaries_icon_id_fkey` FOREIGN KEY (`icon_id`) REFERENCES `emotion_icons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_scales` ADD CONSTRAINT `test_scales_test_code_fkey` FOREIGN KEY (`test_code`) REFERENCES `test_types`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_test_code_fkey` FOREIGN KEY (`test_code`) REFERENCES `test_types`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_test_type_fkey` FOREIGN KEY (`test_type`) REFERENCES `test_types`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `exercise_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_locations` ADD CONSTRAINT `support_locations_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `support_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
