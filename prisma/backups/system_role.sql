-- 插入超级管理员角色
INSERT INTO `system_role` (`name`, `code`, `status`, `remark`) 
VALUES ('超级管理员', 'admin', 1, '超级管理员拥有所有权限');

SET @admin_role_id = LAST_INSERT_ID();

-- 插入普通管理员角色
INSERT INTO `system_role` (`name`, `code`, `status`, `remark`) 
VALUES ('普通管理员', 'common', 1, '普通管理员仅拥有基本权限');

SET @common_role_id = LAST_INSERT_ID();

-- 插入运维管理员角色
INSERT INTO `system_role` (`name`, `code`, `status`, `remark`)
VALUES ('运维管理员', 'ops', 1, '运维管理员负责系统运维和监控');

SET @ops_role_id = LAST_INSERT_ID();

-- 插入安全管理员角色
INSERT INTO `system_role` (`name`, `code`, `status`, `remark`)
VALUES ('安全管理员', 'security', 1, '安全管理员负责系统安全和审计');

SET @security_role_id = LAST_INSERT_ID();

-- 插入审计管理员角色
INSERT INTO `system_role` (`name`, `code`, `status`, `remark`)
VALUES ('审计管理员', 'audit', 1, '审计管理员负责系统操作审计');

SET @audit_role_id = LAST_INSERT_ID();

-- 插入只读用户角色
INSERT INTO `system_role` (`name`, `code`, `status`, `remark`)
VALUES ('只读用户', 'readonly', 1, '只读用户仅有查看权限');

SET @readonly_role_id = LAST_INSERT_ID();