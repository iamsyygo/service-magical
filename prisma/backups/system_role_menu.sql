-- 为超级管理员分配所有菜单权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`)
SELECT @admin_role_id, id FROM `system_menu`;

-- 获取各个目录和菜单的ID
SET @system_dir_id = (SELECT id FROM `system_menu` WHERE `name` = '系统管理' AND `type` = 'directory');
SET @monitor_dir_id = (SELECT id FROM `system_menu` WHERE `name` = '系统监控' AND `type` = 'directory');
SET @tool_dir_id = (SELECT id FROM `system_menu` WHERE `name` = '系统工具' AND `type` = 'directory');

-- 用户管理相关
SET @user_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '用户管理' AND `type` = 'menu');
SET @user_query_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:query');
SET @user_create_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:create');
SET @user_update_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:update');
SET @user_delete_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:delete');
SET @user_reset_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @user_menu_id AND `permission` = 'system:user:reset');

-- 角色管理相关
SET @role_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '角色管理' AND `type` = 'menu');
SET @role_query_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:query');
SET @role_create_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:create');
SET @role_update_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:update');
SET @role_delete_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @role_menu_id AND `permission` = 'system:role:delete');

-- 菜单管理相关
SET @menu_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '菜单管理' AND `type` = 'menu');
SET @menu_query_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:query');
SET @menu_create_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:create');
SET @menu_update_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:update');
SET @menu_delete_btn_id = (SELECT id FROM `system_menu` WHERE `parent_id` = @menu_menu_id AND `permission` = 'system:menu:delete');

-- 监控相关菜单
SET @online_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '在线用户' AND `type` = 'menu');
SET @server_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '服务监控' AND `type` = 'menu');
SET @swagger_menu_id = (SELECT id FROM `system_menu` WHERE `name` = '系统接口' AND `type` = 'menu');

-- 为普通管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
-- 系统管理目录
(@common_role_id, @system_dir_id),
-- 用户管理（基础权限）
(@common_role_id, @user_menu_id),
(@common_role_id, @user_query_btn_id),
(@common_role_id, @user_update_btn_id),
-- 角色管理（只读权限）
(@common_role_id, @role_menu_id),
(@common_role_id, @role_query_btn_id),
-- 监控目录和菜单
(@common_role_id, @monitor_dir_id),
(@common_role_id, @online_menu_id),
(@common_role_id, @server_menu_id);

-- 为运维管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
-- 系统监控完整权限
(@ops_role_id, @monitor_dir_id),
(@ops_role_id, @online_menu_id),
(@ops_role_id, @server_menu_id),
-- 系统工具完整权限
(@ops_role_id, @tool_dir_id),
(@ops_role_id, @swagger_menu_id),
-- 用户管理（只读）
(@ops_role_id, @system_dir_id),
(@ops_role_id, @user_menu_id),
(@ops_role_id, @user_query_btn_id);

-- 为安全管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
-- 用户安全相关权限
(@security_role_id, @system_dir_id),
(@security_role_id, @user_menu_id),
(@security_role_id, @user_query_btn_id),
(@security_role_id, @user_reset_btn_id),
-- 角色管理（完整权限）
(@security_role_id, @role_menu_id),
(@security_role_id, @role_query_btn_id),
(@security_role_id, @role_create_btn_id),
(@security_role_id, @role_update_btn_id),
(@security_role_id, @role_delete_btn_id),
-- 监控权限
(@security_role_id, @monitor_dir_id),
(@security_role_id, @online_menu_id);

-- 为审计管理员分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
-- 系统管理目录（只读权限）
(@audit_role_id, @system_dir_id),
(@audit_role_id, @user_menu_id),
(@audit_role_id, @user_query_btn_id),
(@audit_role_id, @role_menu_id),
(@audit_role_id, @role_query_btn_id),
(@audit_role_id, @menu_menu_id),
(@audit_role_id, @menu_query_btn_id),
-- 监控目录（只读权限）
(@audit_role_id, @monitor_dir_id),
(@audit_role_id, @online_menu_id),
(@audit_role_id, @server_menu_id);

-- 为只读用户分配权限
INSERT INTO `system_role_menu` (`role_id`, `menu_id`) VALUES
-- 系统管理（只读）
(@readonly_role_id, @system_dir_id),
(@readonly_role_id, @user_menu_id),
(@readonly_role_id, @user_query_btn_id),
(@readonly_role_id, @role_menu_id),
(@readonly_role_id, @role_query_btn_id),
-- 监控目录（只读）
(@readonly_role_id, @monitor_dir_id),
(@readonly_role_id, @online_menu_id),
(@readonly_role_id, @server_menu_id);
