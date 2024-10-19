/*
  Warnings:

  - You are about to drop the column `accessToken` on the `user_provider` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user_provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_provider` DROP COLUMN `accessToken`,
    DROP COLUMN `refreshToken`,
    ADD COLUMN `callback_data` JSON NULL;
