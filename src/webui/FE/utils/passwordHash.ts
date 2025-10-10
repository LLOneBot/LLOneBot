/**
 * 密码哈希工具
 * 使用 SHA-256 对密码进行哈希处理
 */

/**
 * 将字符串转换为 SHA-256 哈希
 * @param message 要哈希的字符串
 * @returns 十六进制格式的哈希值
 */
export async function sha256(message: string): Promise<string> {
  // 将字符串编码为 UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  
  // 计算哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * 对密码进行哈希处理
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export async function hashPassword(password: string): Promise<string> {
  return await sha256(password);
}
