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
  // SameSite=Lax: 允许同站和顶级导航携带Cookie，适合局域网IP访问
  //   - Strict: 完全禁止跨站请求（会导致局域网IP访问时Cookie丢失）
  //   - Lax: 允许顶级导航（如直接访问链接），但禁止第三方站点嵌入
  //   - None: 允许所有跨站请求（需配合Secure标志，仅HTTPS可用）
  // Secure: 仅在 HTTPS 下传输（开发环境可能是 HTTP，所以条件判断）
  // HttpOnly: 无法通过 JS 设置（但我们需要 JS 访问，所以不设置）
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';

  // 对于非localhost的IP访问（如局域网IP），不设置SameSite属性以确保兼容性
  const hostname = window.location.hostname;
  const isIpAddress = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
  const sameSiteFlag = isIpAddress ? '' : '; SameSite=Lax';

  const cookieString = `${name}=${value}; ${expires}; path=/${sameSiteFlag}${secureFlag}`;
  document.cookie = cookieString;

  // 调试日志
  // console.log('[Cookie] 设置Cookie:', {
  //   name,
  //   hostname,
  //   isIpAddress,
  //   isSecure,
  //   cookieString,
  //   currentCookies: document.cookie
  // });
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
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      // console.log('[Cookie] 获取Cookie:', { name, value, allCookies: document.cookie });
      return value;
    }
  }

  console.log('[Cookie] 未找到Cookie:', { name, allCookies: document.cookie });
  return null;
}

/**
 * 删除 Cookie
 * @param name Cookie 名称
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
