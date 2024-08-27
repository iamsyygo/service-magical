/*
Warnings:
- A unique constraint covering the columns `[email]` on the table `system_user` will be added. If there are existing duplicate values, this will fail.
- Added the required column `email` to the `system_user` table without a default value. This is not possible if the table is not empty.
*/
-- AlterTable
ALTER TABLE `system_user` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `system_user_email_key` ON `system_user` (`email`);