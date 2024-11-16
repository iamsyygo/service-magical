-- 初始化系统数据
-- 说明：系统初始化SQL，包含基础用户、角色、菜单等数据

-- 步骤1: 清空所有表
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `system_user_role`;
TRUNCATE TABLE `system_role_menu`;
TRUNCATE TABLE `system_menu`;
TRUNCATE TABLE `system_role`;
TRUNCATE TABLE `system_user`;
TRUNCATE TABLE `user_provider`;
SET FOREIGN_KEY_CHECKS = 1;

-- 重置自增ID
ALTER TABLE `system_user` AUTO_INCREMENT = 1;
ALTER TABLE `system_role` AUTO_INCREMENT = 1;
ALTER TABLE `system_menu` AUTO_INCREMENT = 1;
ALTER TABLE `system_user_role` AUTO_INCREMENT = 1;
ALTER TABLE `system_role_menu` AUTO_INCREMENT = 1;
ALTER TABLE `user_provider` AUTO_INCREMENT = 1;

-- 步骤2: 初始化角色数据
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

-- 步骤3: 初始化用户数据
-- 插入超级管理员用户
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`) 
VALUES ('admin', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'admin@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/1?v=4');
SET @admin_user_id = LAST_INSERT_ID();

-- 插入系统管理员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('system', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'system@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/2?v=4');
SET @system_user_id = LAST_INSERT_ID();

-- 插入测试用户
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('test', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'test@example.com', 'UNKNOWN', 'https://avatars.githubusercontent.com/u/3?v=4');
SET @test_user_id = LAST_INSERT_ID();

-- 插入运维人员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('ops', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'ops@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/4?v=4');
SET @ops_user_id = LAST_INSERT_ID();

-- 插入安全管理员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('security', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'security@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/5?v=4');
SET @security_user_id = LAST_INSERT_ID();

-- 插入审计人员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('audit', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'audit@example.com', 'GIRL', 'https://avatars.githubusercontent.com/u/6?v=4');
SET @audit_user_id = LAST_INSERT_ID();

-- 插入普通用户
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('user', '$2a$10$DksWt5hC0taaHNXhpjay3eTuXJJwOD.L8QO2jKGFD3aR5jIR1.8Lq', 'user@example.com', 'UNKNOWN', 'https://avatars.githubusercontent.com/u/7?v=4');
SET @normal_user_id = LAST_INSERT_ID();

-- 步骤4: 初始化菜单数据
-- 设置图标变量
SET @setting_icon = 'i-fluent-emoji:gear';
SET @user_icon = 'i-fluent-emoji:bust-in-silhouette';
SET @role_icon = 'i-fluent-emoji:busts-in-silhouette';
SET @menu_icon = 'i-fluent-emoji:clipboard';
SET @monitor_icon = 'i-fluent-emoji:chart-increasing';
SET @online_icon = 'i-fluent-emoji:mobile-phone';
SET @server_icon = 'i-fluent-emoji:desktop-computer';
SET @tool_icon = 'i-fluent-emoji:hammer-and-wrench';
SET @api_icon = 'i-fluent-emoji:antenna-bars';

-- 插入系统管理目录
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (NULL, '系统管理', '/atl/system', NULL, NULL, 'directory', @setting_icon, 1, 1, 0, 0, 1);
SET @system_id = LAST_INSERT_ID();

-- 插入用户管理菜单
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@system_id, '用户管理', '/atl/system/user', '/views/system/user/index', 'system:user:list', 'menu', @user_icon, 1, 1, 0, 0, 1);
SET @user_id = LAST_INSERT_ID();

-- 用户管理按钮
INSERT INTO `system_menu` (`parent_id`, `name`, `permission`, `type`, `order_num`, `status`, `is_visible`) 
VALUES 
(@user_id, '用户查询', 'system:user:query', 'button', 1, 1, 1),
(@user_id, '用户新增', 'system:user:create', 'button', 2, 1, 1),
(@user_id, '用户修改', 'system:user:update', 'button', 3, 1, 1),
(@user_id, '用户删除', 'system:user:delete', 'button', 4, 1, 1),
(@user_id, '重置密码', 'system:user:reset', 'button', 5, 1, 1);

-- 插入角色管理菜单
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@system_id, '角色管理', '/atl/system/role', '/views/system/role/index', 'system:role:list', 'menu', @role_icon, 2, 1, 0, 0, 1);
SET @role_id = LAST_INSERT_ID();

-- 角色管理按钮
INSERT INTO `system_menu` (`parent_id`, `name`, `permission`, `type`, `order_num`, `status`, `is_visible`) 
VALUES 
(@role_id, '角色查询', 'system:role:query', 'button', 1, 1, 1),
(@role_id, '角色新增', 'system:role:create', 'button', 2, 1, 1),
(@role_id, '角色修改', 'system:role:update', 'button', 3, 1, 1),
(@role_id, '角色删除', 'system:role:delete', 'button', 4, 1, 1);

-- 插入菜单管理
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@system_id, '菜单管理', '/atl/system/menu', '/views/system/menu/index', 'system:menu:list', 'menu', @menu_icon, 3, 1, 0, 0, 1);
SET @menu_id = LAST_INSERT_ID();

-- 菜单管理按钮
INSERT INTO `system_menu` (`parent_id`, `name`, `permission`, `type`, `order_num`, `status`, `is_visible`) 
VALUES 
(@menu_id, '菜单查询', 'system:menu:query', 'button', 1, 1, 1),
(@menu_id, '菜单新增', 'system:menu:create', 'button', 2, 1, 1),
(@menu_id, '菜单修改', 'system:menu:update', 'button', 3, 1, 1),
(@menu_id, '菜单删除', 'system:menu:delete', 'button', 4, 1, 1);

-- 插入系统监控目录
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (NULL, '系统监控', '/atl/monitor', NULL, NULL, 'directory', @monitor_icon, 2, 1, 0, 0, 1);
SET @monitor_id = LAST_INSERT_ID();

-- 插入在线用户菜单
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@monitor_id, '在线用户', '/atl/monitor/online', '/views/monitor/online/index', 'monitor:online:list', 'menu', @online_icon, 1, 1, 0, 0, 1);

-- 插入服务监控菜单
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@monitor_id, '服务监控', '/atl/monitor/server', '/views/monitor/server/index', 'monitor:server:list', 'menu', @server_icon, 2, 1, 0, 0, 1);

-- 插入系统工具目录
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (NULL, '系统工具', '/atl/tool', NULL, NULL, 'directory', @tool_icon, 3, 1, 0, 0, 1);
SET @tool_id = LAST_INSERT_ID();

-- 插入系统接口菜单
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@tool_id, '系统接口', '/atl/tool/swagger', '/views/tool/swagger/index', 'tool:swagger:list', 'menu', @api_icon, 1, 1, 0, 0, 1);

-- 步骤5: 初始化用户角色关联
-- 为用户分配角色
INSERT INTO `system_user_role` (`user_id`, `role_id`) VALUES
(@admin_user_id, @admin_role_id),
(@system_user_id, @common_role_id),
(@system_user_id, @security_role_id),
(@test_user_id, @readonly_role_id),
(@ops_user_id, @ops_role_id),
(@security_user_id, @security_role_id),
(@audit_user_id, @audit_role_id),
(@normal_user_id, @readonly_role_id);

-- 步骤6: 初始化角色菜单关联
-- 为超级管理员分配所有菜单权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`)
SELECT @admin_role_id, id FROM `system_menu`;

-- 获取各个目录和菜单的ID
SET @system_dir_id = (SELECT id FROM `system_menu` WHERE `name` = '系统管理' AND `type` = 'directory');
SET @monitor_dir_id = (SELECT id FROM `system_menu` WHERE `name` = '系统监控' AND `type` = 'directory');
SET @tool_dir_id = (SELECT id FROM `system_menu` WHERE `name` = '系统工具' AND `type` = 'directory');

-- 获取用户管理相关ID
SET @user_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '用户管理' AND `type` = 'menu');
SET @user_query_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:query');
SET @user_create_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:create');
SET @user_update_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:update');
SET @user_delete_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:delete');
SET @user_reset_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:reset');

-- 获取角色管理相关ID
SET @role_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '角色管理' AND `type` = 'menu');
SET @role_query_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:query');
SET @role_create_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:create');
SET @role_update_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:update');
SET @role_delete_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:delete');

-- 获取菜单管理相关ID
SET @menu_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '菜单管理' AND `type` = 'menu');
SET @menu_query_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:query');
SET @menu_create_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:create');
SET @menu_update_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:update');
SET @menu_delete_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:delete');

-- 获取监控相关菜单ID
SET @online_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '在线用户' AND `type` = 'menu');
SET @server_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '服务监控' AND `type` = 'menu');
SET @swagger_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '系统接口' AND `type` = 'menu');

-- 为普通管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
(@common_role_id, @system_dir_id),
(@common_role_id, @user_menu_id),
(@common_role_id, @user_query_btn_id),
(@common_role_id, @user_update_btn_id),
(@common_role_id, @role_menu_id),
(@common_role_id, @role_query_btn_id),
(@common_role_id, @monitor_dir_id),
(@common_role_id, @online_menu_id),
(@common_role_id, @server_menu_id);

-- 为运维管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
(@ops_role_id, @monitor_dir_id),
(@ops_role_id, @online_menu_id),
(@ops_role_id, @server_menu_id),
(@ops_role_id, @tool_dir_id),
(@ops_role_id, @swagger_menu_id),
(@ops_role_id, @system_dir_id),
(@ops_role_id, @user_menu_id),
(@ops_role_id, @user_query_btn_id);

-- 为安全管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
(@security_role_id, @system_dir_id),
(@security_role_id, @user_menu_id),
(@security_role_id, @user_query_btn_id),
(@security_role_id, @user_reset_btn_id),
(@security_role_id, @role_menu_id),
(@security_role_id, @role_query_btn_id),
(@security_role_id, @role_create_btn_id),
(@security_role_id, @role_update_btn_id),
(@security_role_id, @role_delete_btn_id),
(@security_role_id, @monitor_dir_id),
(@security_role_id, @online_menu_id);

-- 为审计管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
(@audit_role_id, @system_dir_id),
(@audit_role_id, @user_menu_id),
(@audit_role_id, @user_query_btn_id),
(@audit_role_id, @role_menu_id),
(@audit_role_id, @role_query_btn_id),
(@audit_role_id, @menu_menu_id),
(@audit_role_id, @menu_query_btn_id),
(@audit_role_id, @monitor_dir_id),
(@audit_role_id, @online_menu_id),
(@audit_role_id, @server_menu_id);

-- 为只读用户分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
(@readonly_role_id, @system_dir_id),
(@readonly_role_id, @user_menu_id),
(@readonly_role_id, @user_query_btn_id),
(@readonly_role_id, @role_menu_id),
(@readonly_role_id, @role_query_btn_id),
(@readonly_role_id, @monitor_dir_id),
(@readonly_role_id, @online_menu_id),
(@readonly_role_id, @server_menu_id);

-- 步骤7: 创建并更新统计表
CREATE TABLE IF NOT EXISTS `system_init_statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) NOT NULL COMMENT '表名',
  `total_records` int NOT NULL DEFAULT '0' COMMENT '记录总数',
  `init_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '初始化时间',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_table_name` (`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统初始化统计表';

-- 插入统计数据
INSERT INTO `system_init_statistics` (`table_name`, `total_records`, `remark`)
SELECT 'system_user', COUNT(*), '系统用户表初始化记录' FROM `system_user`
UNION ALL
SELECT 'system_role', COUNT(*), '系统角色表初始化记录' FROM `system_role`
UNION ALL
SELECT 'system_menu', COUNT(*), '系统菜单表初始化记录' FROM `system_menu`
UNION ALL
SELECT 'system_user_role', COUNT(*), '用户角色关联表初始化记录' FROM `system_user_role`
UNION ALL
SELECT 'system_role_menu', COUNT(*), '角色菜单关联表初始化记录' FROM `system_role_menu`
UNION ALL
SELECT 'user_provider', COUNT(*), '第三方登录表初始化记录' FROM `user_provider`;

-- 查看初始化结果
SELECT 
  table_name as '表名',
  total_records as '记录数',
  DATE_FORMAT(init_time, '%Y-%m-%d %H:%i:%s') as '初始化时间',
  CASE status 
    WHEN 1 THEN '成功'
    ELSE '失败'
  END as '状态',
  remark as '备注'
FROM `system_init_statistics`
ORDER BY init_time DESC; 