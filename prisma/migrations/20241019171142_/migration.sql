/*
  Warnings:

  - You are about to drop the column `createdAt` on the `system_user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `system_user` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_provider` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `user_provider` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_provider` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_provider` table. All the data in the column will be lost.
  - Added the required column `provider_id` to the `user_provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `system_user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `updated_at` TIMESTAMP(6) NULL;

-- AlterTable
ALTER TABLE `user_provider` DROP COLUMN `createdAt`,
    DROP COLUMN `providerId`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `provider_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` TIMESTAMP(6) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;
