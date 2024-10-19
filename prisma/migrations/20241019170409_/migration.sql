-- CreateTable
CREATE TABLE `system_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,
    `avatar` VARCHAR(255) NULL,
    `sex` ENUM('MALE', 'GIRL', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `email` VARCHAR(191) NOT NULL,
    `platform` ENUM('local', 'github', 'google') NOT NULL DEFAULT 'local',
    `user_provider_id` INTEGER NULL,

    UNIQUE INDEX `system_user_username_key`(`username`),
    UNIQUE INDEX `system_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_provider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `provider` ENUM('local', 'github', 'google') NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookmarks_vault` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,
    `title` VARCHAR(200) NOT NULL,
    `origin_title` VARCHAR(200) NULL,
    `def_title` VARCHAR(200) NULL,
    `url` VARCHAR(800) NOT NULL,
    `add_date` INTEGER NOT NULL,
    `icon` TEXT NULL,
    `html` TEXT NULL,
    `text` TEXT NULL,
    `is_handled` BOOLEAN NULL DEFAULT false,
    `describes` VARCHAR(500) NULL,
    `types` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
