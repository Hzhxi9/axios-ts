import * as Utils from "./utils";

import { Method } from "../types";

/**
 * 标准化header名称
 * 标准规定的是请求和响应的 Header 字段名是首字母大写这种格式,所以为了防止用户传入的字段名是其他格式，如全是小写content-type,所以我们先要把 header字段名规范化。
 */
function normalizeHeaderName(headers: any, normalizeName: string) {
  if (!headers) return;

  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
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

  headers.split("\r\n").forEach(line => {
    let [key, value] = line.split(":");
    key = key.trim().toLowerCase();
    if (!key) return;
    if (value) value = value.trim();

    res[key] = value;
  });

  return res;
}

/**
 * 扁平化headers
 * 即把所有属性提取出来放入headers下
 * 对于common中定义的headers字段，都要提取
 * 而对于get、post这类提取，需要和该次请求的方法对应
 *
 * 合并后的headers
 * headers: {
 *   common: { Accept: 'application/json, text/plain, */
/*' },
 *   post: { 'Content-Type':'application/x-www-form-urlencoded'}
 * }
 * 真正发请求所需要的headers
 * headers: {
 *   Accept: 'application/json, text/plain, */
/*',
 *   'Content-Type':'application/x-www-form-urlencoded'
 * }
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) return headers;

  /**用merge将common、post的属性拷贝到headers这一级 */
  headers = Utils.merge(headers.common || {}, headers[method] || {}, headers);

  const methodsToDelete = ["delete", "get", "head", "options", "post", "put", "patch", "common"];
  /**然后删除这些属性 */
  methodsToDelete.forEach(method => {
    delete headers[method];
  });

  return headers;
}
