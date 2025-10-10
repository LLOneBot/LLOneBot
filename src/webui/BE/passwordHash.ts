import crypto from 'node:crypto';

/**
 * 使用 SHA-256 对密码进行哈希
 * @param password 明文密码
 * @returns 哈希后的密码（十六进制字符串）
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
