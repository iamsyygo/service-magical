-- CreateTable
CREATE TABLE `system_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,
    `avatar` VARCHAR(255) NULL,
    `sex` ENUM('GIRL', 'MAN', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `system_user_username_key`(`username`),
    UNIQUE INDEX `system_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quick_build_template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NOT NULL,
    `table_name` VARCHAR(100) NOT NULL,
    `comment` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quick_build_template_map` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(100) NOT NULL,
    `table_name` VARCHAR(100) NOT NULL,
    `column_name` VARCHAR(100) NOT NULL,
    `column_title` VARCHAR(100) NULL,
    `merge_amount` INTEGER NULL DEFAULT 1,
    `column_index` INTEGER NOT NULL,
    `row_index` INTEGER NOT NULL,
    `form_type` VARCHAR(100) NOT NULL,
    `comment` VARCHAR(255) NULL,
    `pid` INTEGER NULL,
    `is_inquire` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` TIMESTAMP(6) NULL,

    UNIQUE INDEX `quick_build_template_map_column_name_key`(`column_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
