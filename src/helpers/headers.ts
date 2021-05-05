import * as Utils from "./utils";

/**
 * 标准化header名称
 * 标准规定的是请求和响应的 Header 字段名是首字母大写这种格式,所以为了防止用户传入的字段名是其他格式，如全是小写content-type,所以我们先要把 header字段名规范化。
 */
function normalizeHeaderName(headers: any, normalizeName: string) {
  if (!headers) return;

  Object.keys(headers).forEach((name) => {
    if (
      name !== normalizeName &&
      name.toUpperCase() === normalizeName.toUpperCase()
    ) {
      headers[normalizeName] = headers[name];
      delete headers[name];
    }
  });
}

/**
 *  使用POST请求时,设置请求头Content-type为json格式，让服务端接受请求并正确解析请求
 */
export default function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, "Content-Type");

  if (Utils.isObject(data)) {
    if (headers && !headers["Content-Type"])
      headers["Content-Type"] = "application/json;charset=utf-8";
  }
  return headers;
}

/**
 * 处理响应式headers
 * 将字符串headers转换为对象形式
 */
export function parseHeaders(headers: string): any {
  let res = Object.create(null);

  if (!headers) return res;

  headers.split("\r\n").forEach((line) => {
    let [key, value] = line.split(":");
    key = key.trim().toLowerCase();
    if (!key) return;
    if (value) value = value.trim();

    res[key] = value;
  });

  return res;
}
