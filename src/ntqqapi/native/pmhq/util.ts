type DataWrapper = {
  __dataType?: string;
  data?: unknown;
};

export function deepStringifyMap(obj: any): any {
  // 基本类型直接返回
  if (typeof obj !== 'object' || obj === null) return obj;

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item: any) => deepStringifyMap(item));
  }

  // 处理 Map 对象
  if (obj instanceof Map) {
    return {
      __dataType: 'Map',
      data: Array.from(obj.entries()).map(([k, v]) => [
        deepStringifyMap(k),  // 递归处理 key
        deepStringifyMap(v)   // 递归处理 value
      ])
    };
  }

  // 处理普通对象
  const convertedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      convertedObj[key] = deepStringifyMap(obj[key]);
    }
  }
  return convertedObj;
}
export function deepConvertMap<T>(obj: T): T {
  // 基本类型直接返回
  if (typeof obj !== 'object' || obj === null) return obj;

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepConvertMap(item)) as T;
  }

  // 处理 Map 包装对象
  const potentialMap = obj as DataWrapper;
  if (potentialMap.__dataType === 'Map' && 'data' in potentialMap) {
    const entries = Array.isArray(potentialMap.data)
      ? (potentialMap.data as [any, any][]).map(([k, v]) => [
        deepConvertMap(k),
        deepConvertMap(v),
      ])
      : [];
    return new Map(entries as Iterable<any, any>) as T;
  }

  // 处理普通对象
  const convertedObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      convertedObj[key] = deepConvertMap((obj as Record<string, any>)[key]);
    }
  }
  return convertedObj as T;
}
