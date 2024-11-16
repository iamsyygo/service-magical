-- 从icons.json中选择的一些合适的图标
SET @setting_icon = 'i-fluent-emoji:gear';
SET @user_icon = 'i-fluent-emoji:bust-in-silhouette';
SET @role_icon = 'i-fluent-emoji:busts-in-silhouette';
SET @menu_icon = 'i-fluent-emoji:clipboard';
SET @monitor_icon = 'i-fluent-emoji:chart-increasing';
SET @online_icon = 'i-fluent-emoji:mobile-phone';
SET @server_icon = 'i-fluent-emoji:desktop-computer';
SET @tool_icon = 'i-fluent-emoji:hammer-and-wrench';
SET @api_icon = 'i-fluent-emoji:antenna-bars';

-- 系统管理目录
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (NULL, '系统管理', '/atl/system', NULL, NULL, 'directory', @setting_icon, 1, 1, 0, 0, 1);

-- 获取刚插入的系统管理ID
SET @system_id = LAST_INSERT_ID();

-- 用户管理菜单
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

-- 角色管理菜单
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

-- 菜单管理
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

-- 系统监控目录
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (NULL, '系统监控', '/atl/monitor', NULL, NULL, 'directory', @monitor_icon, 2, 1, 0, 0, 1);

SET @monitor_id = LAST_INSERT_ID();

-- 在线用户
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@monitor_id, '在线用户', '/atl/monitor/online', '/views/monitor/online/index', 'monitor:online:list', 'menu', @online_icon, 1, 1, 0, 0, 1);

-- 服务监控
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@monitor_id, '服务监控', '/atl/monitor/server', '/views/monitor/server/index', 'monitor:server:list', 'menu', @server_icon, 2, 1, 0, 0, 1);

-- 系统工具目录
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (NULL, '系统工具', '/atl/tool', NULL, NULL, 'directory', @tool_icon, 3, 1, 0, 0, 1);

SET @tool_id = LAST_INSERT_ID();

-- 系统接口
INSERT INTO `system_menu` (`parent_id`, `name`, `path`, `component`, `permission`, `type`, `icon`, `order_num`, `status`, `is_external`, `is_cache`, `is_visible`) 
VALUES (@tool_id, '系统接口', '/atl/tool/swagger', '/views/tool/swagger/index', 'tool:swagger:list', 'menu', @api_icon, 1, 1, 0, 0, 1);
