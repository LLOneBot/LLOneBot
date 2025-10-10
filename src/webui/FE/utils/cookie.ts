/**
 * Cookie 工具函数
 */

/**
 * 设置 Cookie
 * @param name Cookie 名称
 * @param value Cookie 值
 * @param days 过期天数（默认 30 天）
 */
export function setCookie(name: string, value: string, days: number = 30): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  
  // 设置 Cookie 属性
  // SameSite=Strict: 防止 CSRF 攻击
  // Secure: 仅在 HTTPS 下传输（开发环境可能是 HTTP，所以条件判断）
  // HttpOnly: 无法通过 JS 设置（但我们需要 JS 访问，所以不设置）
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict${secureFlag}`;
}

/**
 * 获取 Cookie
 * @param name Cookie 名称
 * @returns Cookie 值，如果不存在返回 null
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
}

/**
 * 删除 Cookie
 * @param name Cookie 名称
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
