-- 插入超级管理员用户
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`) 
VALUES ('admin', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'admin@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/1?v=4');

SET @admin_user_id = LAST_INSERT_ID();

-- 插入系统管理员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('system', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'system@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/2?v=4');

SET @system_user_id = LAST_INSERT_ID();

-- 插入测试用户
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('test', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'test@example.com', 'UNKNOWN', 'https://avatars.githubusercontent.com/u/3?v=4');

SET @test_user_id = LAST_INSERT_ID();

-- 插入运维人员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('ops', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'ops@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/4?v=4');

SET @ops_user_id = LAST_INSERT_ID();

-- 插入安全管理员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('security', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'security@example.com', 'MALE', 'https://avatars.githubusercontent.com/u/5?v=4');

SET @security_user_id = LAST_INSERT_ID();

-- 插入审计人员
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('audit', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'audit@example.com', 'GIRL', 'https://avatars.githubusercontent.com/u/6?v=4');

SET @audit_user_id = LAST_INSERT_ID();

-- 插入普通用户
INSERT INTO `system_user` (`username`, `password`, `email`, `sex`, `avatar`)
VALUES ('user', '$2b$10$4YGNyZBrWHxgQn1TlgYE7.LbcC1IEM5I1DHOKcJO9EZqMz9N.6NAm', 'user@example.com', 'UNKNOWN', 'https://avatars.githubusercontent.com/u/7?v=4');

SET @normal_user_id = LAST_INSERT_ID(); 