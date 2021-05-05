import * as Utils from "./utils";

/**
 * 解码Url
 */
function encode(url: string): string {
  return encodeURIComponent(url)
    .replace(/%3A/gi, ":")
    .replace(/%24/gi, "$")
    .replace(/%2c/gi, ",")
    .replace(/%20/gi, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

/**
 *  拼接url与参数
 *  1. 参数为普通参数 === /api/handleRequestURL/get?a=1&b=2
 *  2. 参数为数组 === /api/handleRequestURL/get?foo[]=bar&foo[]=baz
 *  3. 参数为对象 === /api/handleRequestURL/get?foo=%7B%22bar%22:%22baz%22%7D,foo 后面拼接的是 {"bar":"baz"}encode 后的结果
 *  4. 参数为Date === /api/handleRequestURL/get?date=2019-07-24T04:46:41.05190Z
 *  5. 参数包含特殊字符 === /api/handleRequestURL/get?foo=@:$+,注意，空格 会被转换成 +
 *  6. 参数为null或者undefined === /api/handleRequestURL/get?foo=bar,对于值为 null 或者 undefined 的属性，会被丢弃。
 *  7. 参数存在哈希#标记 === /api/handleRequestURL/get,当原始url中存在哈希标记（#）时，所携带的所有参数params会被忽略，并且请求的url不包含#之后的东西。
 *  8. 参数已存在参数 === /api/handleRequestURL/get?foo=bar&bar=baz,会把携带的参数拼接到已存在参数的后面。
 *
 * @param {String} url 请求链接
 * @param {Object} [params] 请求参数
 * @param paramsSerializer
 */

export function buildURL(url: string, params?: any, paramsSerializer?: any) {
  /** 如果params为空,则直接返回url*/
  if (!params) return url;

  /** 如果url中有哈希标记,则直接放回原始url*/
  if (url.includes("#")) {
    const hashMarkIndex = url.indexOf("#");
    url = url.slice(0, hashMarkIndex);
    return url;
  }

  let serializeParams: string;

  if (paramsSerializer) {
    /**
     * 传入序列化函数
     * 类似qs.stringify(params, { indices: false })
     * */
    serializeParams = paramsSerializer(params);
  } else if (Utils.isURLSearchParams(params)) {
    /**
     * 符合isURLSearchParams,直接发返回字符串
     */
    serializeParams = params.toString();
  } else {
    /**
     * 定义键值对数组,用于最后拼接url,将params中的键值对进行处理最终放入parts中
     * parts最后处理为['key=value','a=1',...]
     */
    const parts: string[] = [];

    /**遍历params所有键值对 */
    Object.keys(params).forEach(key => {
      let val = params[key];
      /**如果有为undefined或者null,不进行处理,直接跳出循环 */
      if (val === null || typeof val === "undefined") return;

      let values: string[];

      if (Utils.isArray(val)) {
        /**如果值为数组,则将该值赋给临时遍历values,用于下面遍历处理 */
        values = val;
        key += "[]";
      } else {
        /**如果不是数组，则强行改造为数组处理 */
        values = [val];
      }

      values.forEach(val => {
        if (Utils.isDate(val)) {
          val = val.toISOString();
        } else if (Utils.isObject(val)) {
          val = JSON.stringify(val);
        }
        parts.push(`${encode(key)}=${encode(val)}`);
      });
    });

    /**用&分割输出 */
    serializeParams = parts.join("&");
  }

  /**
   * 判断原始url是否有已存在的参数，即判断是否有?
   * 有则将处理后的键值对用&拼接在url后面
   * 没有则将处理后的键值对用?拼接在url后面
   */
  if (serializeParams) url += (url.indexOf("?") === -1 ? "?" : "&") + serializeParams;
}
