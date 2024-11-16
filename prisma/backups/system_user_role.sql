-- 为超级管理员用户分配超级管理员角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) 
VALUES (@admin_user_id, @admin_role_id);

-- 为系统管理员分配角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) VALUES
(@system_user_id, @common_role_id),
(@system_user_id, @security_role_id);

-- 为测试用户分配只读角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) 
VALUES (@test_user_id, @readonly_role_id);

-- 为运维人员分配运维角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) 
VALUES (@ops_user_id, @ops_role_id);

-- 为安全管理员分配安全角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) 
VALUES (@security_user_id, @security_role_id);

-- 为审计人员分配审计角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) 
VALUES (@audit_user_id, @audit_role_id);

-- 为普通用户分配普通角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) 
VALUES (@normal_user_id, @readonly_role_id);

-- 为一些用户分配多个角色（用于测试多角色场景）
INSERT INTO `system_user_role` (`user_id`, `role_id`) VALUES
-- 系统管理员额外拥有运维权限
(@system_user_id, @ops_role_id),
-- 安全管理员额外拥有审计权限
(@security_user_id, @audit_role_id),
-- 运维人员额外拥有只读权限
(@ops_user_id, @readonly_role_id); 