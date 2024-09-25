// Redis 客户端名称
export const REDIS_CLIENT = 'APP_REDIS_CLIENT';

// MinIO 客户端名称
export const MINIO_CLIENT = 'APP_MINIO_CLIENT';

// Redis 相关 Key 值
export const REDIS_KEYS = {
  // 注册验证码
  REGISTER_CAPTCHA: 'captcha_register',
  // 登录验证码
  SIGNIN_CAPTCHA: 'captcha_signin',
  // 更新用户密码
  UPDATE_USER_PASSWORD: 'captcha_update_password',
  // 更新用户数据
  UPDATE_USER_DATA: 'captcha_update_user',
};

// 不验证 JWT
export const EXCLUDE_JWT_VERIFICATION = 'reflector:skip_jwt_verify';
