-- CreateTable
CREATE TABLE `system_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '主键',
    `username` VARCHAR(191) NOT NULL COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updatedAt` TIMESTAMP(6) NULL COMMENT '更新时间',
    `avatar` VARCHAR(255) NULL COMMENT '头像',
    `sex` ENUM('GIRL', 'MAN', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN' COMMENT '性别',
    `email` VARCHAR(191) NOT NULL COMMENT '电子邮件',


    UNIQUE INDEX `system_user_username_key`(`username`),
    UNIQUE INDEX `system_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='系统用户表';