-- 创建用户表
CREATE TABLE `system_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '用户ID，自增',
    `username` VARCHAR(191) NOT NULL COMMENT '用户名',
    `password` VARCHAR(50) NOT NULL COMMENT '用户密码',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updatedAt` DATETIME(3) NULL COMMENT '更新时间',
    `avatar` VARCHAR(255) NULL COMMENT '头像',
    `sex` ENUM('GIRL','MAN','UNKNOWN') NOT NULL DEFAULT 'UNKNOWN' COMMENT '性别',


    UNIQUE INDEX `system_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='用户表';