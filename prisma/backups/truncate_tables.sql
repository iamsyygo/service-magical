-- 临时禁用外键约束检查
SET FOREIGN_KEY_CHECKS = 0;

-- 清空所有相关表并重置自增ID
TRUNCATE TABLE `system_user_role`;
TRUNCATE TABLE `system_role_menu`;
TRUNCATE TABLE `system_menu`;
TRUNCATE TABLE `system_role`;
TRUNCATE TABLE `system_user`;
TRUNCATE TABLE `user_provider`;

-- 重新启用外键约束检查
SET FOREIGN_KEY_CHECKS = 1;

-- 重置各表的自增ID
ALTER TABLE `system_user` AUTO_INCREMENT = 1;
ALTER TABLE `system_role` AUTO_INCREMENT = 1;
ALTER TABLE `system_menu` AUTO_INCREMENT = 1;
ALTER TABLE `system_user_role` AUTO_INCREMENT = 1;
ALTER TABLE `system_role_menu` AUTO_INCREMENT = 1;
ALTER TABLE `user_provider` AUTO_INCREMENT = 1; 