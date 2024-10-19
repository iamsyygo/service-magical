/*
  Warnings:

  - You are about to alter the column `platform` on the `system_user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `system_user` MODIFY `platform` ENUM('LOCAL', 'GITHUB', 'GOOGLE') NOT NULL DEFAULT 'LOCAL';
