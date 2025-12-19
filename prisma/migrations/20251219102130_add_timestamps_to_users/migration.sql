/*
  Warnings:

  - The primary key for the `assessments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tokens_used` on the `chat_messages` table. All the data in the column will be lost.
  - The primary key for the `chat_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `icon_url` on the `emotion_diaries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `exercise_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exercises` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `support_locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `support_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `test_scales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `value` on the `test_scales` table. All the data in the column will be lost.
  - The primary key for the `test_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - Added the required column `title` to the `test_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assessments` DROP FOREIGN KEY `assessments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `chat_messages` DROP FOREIGN KEY `chat_messages_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `chat_sessions` DROP FOREIGN KEY `chat_sessions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `emotion_diaries` DROP FOREIGN KEY `emotion_diaries_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `exercises` DROP FOREIGN KEY `exercises_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `support_locations` DROP FOREIGN KEY `support_locations_type_id_fkey`;

-- DropIndex
DROP INDEX `test_scales_test_code_value_key` ON `test_scales`;

-- AlterTable
ALTER TABLE `assessments` DROP PRIMARY KEY,
    ADD COLUMN `severity` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `user_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `chat_messages` DROP COLUMN `tokens_used`,
    MODIFY `session_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `chat_sessions` DROP PRIMARY KEY,
    MODIFY `session_id` VARCHAR(36) NOT NULL,
    MODIFY `user_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`session_id`);

-- AlterTable
ALTER TABLE `emotion_diaries` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `icon_url` VARCHAR(191) NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL,
    MODIFY `user_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `emotion_icons` MODIFY `icon` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `exercise_categories` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `exercises` DROP PRIMARY KEY,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `category_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `questions` DROP PRIMARY KEY,
    ADD COLUMN `options` JSON NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `support_locations` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `type_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `support_types` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `test_scales` DROP PRIMARY KEY,
    DROP COLUMN `value`,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `test_types` DROP PRIMARY KEY,
    ADD COLUMN `title` VARCHAR(255) NOT NULL,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `clinical_insights` (
    `id` VARCHAR(36) NOT NULL,
    `session_id` VARCHAR(36) NOT NULL,
    `detected_symptoms` JSON NULL,
    `mood_assessment` VARCHAR(191) NULL,
    `clinical_note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setting_mails` (
    `id` VARCHAR(36) NOT NULL,
    `mail_type` VARCHAR(50) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `description` VARCHAR(255) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `setting_mails_mail_type_key`(`mail_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emotion_diaries` ADD CONSTRAINT `emotion_diaries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clinical_insights` ADD CONSTRAINT `clinical_insights_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `exercise_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_locations` ADD CONSTRAINT `support_locations_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `support_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
