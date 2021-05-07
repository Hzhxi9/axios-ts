/**
 * 合并默认配置和用户设置配置
 */
import { AxiosRequestConfig } from "../types";
import { isValidKey, merge, isObject } from "../helpers/utils";

export default function mergeConfig(
  defaultsConfig: AxiosRequestConfig,
  userConfig?: AxiosRequestConfig
) {
  let config = Object.create(null);
  /**常规属性,如果用户配置了就用用户配置的,用户没有配置则用默认 */
  const defaultToUserConfig = [
    "baseURL",
    "transformRequest",
    "transformResponse",
    "paramsSerializer",
    "timeout",
    "withCredentials",
    "adapter",
    "responseType",
    "xsrfCookieName",
    "xsrfHeaderName",
    "onUploadProgress",
    "onDownloadProgress",
    "maxContentLength",
    "validateStatus",
    "maxRedirects",
    "httpAgent",
    "httpsAgent",
    "cancelToken",
    "socketPath",
  ];

  defaultToUserConfig.forEach(prop => {
    userConfig = userConfig || {};
    if (isValidKey(prop, userConfig)) {
      /**如果用户配置有设置 */
      if (typeof userConfig[prop] !== "undefined") {
        /**则用用户设置的 */
        config[prop] = userConfig[prop];
        /**如果用户配置没有,默认配置里有 */
      } else if (typeof defaultsConfig[prop] !== "undefined") {
        /**则用默认配置的 */
        config[prop] = defaultsConfig[prop];
      }
    }
  });

  /**只接受用户配置,不管默认配置对象里面有没有,只取用用户配置 */
  const valueFromUserConfig = ["url", "method", "params", "data"];
  valueFromUserConfig.forEach(prop => {
    userConfig = userConfig || {};
    if (isValidKey(prop, userConfig)) {
      if (typeof userConfig[prop] !== "undefined") config[prop] = userConfig[prop];
    }
  });

  /**
   * 复制对象深度合并
   * 对于header、auth等属性进行深度合并
   * 例如两个header内字段不相同的属性要拷贝合并在一起，属性字段相同，内容不一样也要合并
   **/
  const mergeDeepProperties = ["headers", "auth", "proxy"];
  mergeDeepProperties.forEach(prop => {
    userConfig = userConfig || {};
    if (isValidKey(prop, userConfig)) {
      if (isObject(userConfig[prop])) {
        /** 用户配置对象存在headers,并且是对象,深度合并默认配置和用户配置*/
        config[prop] = merge(defaultsConfig[prop], userConfig[prop]);
      } else if (typeof userConfig[prop] !== "undefined") {
        /** 用户配置对象存在headers,并且不是对象,直接赋值给config的headers */
        config[prop] = userConfig[prop];
      } else if (isObject(defaultsConfig[prop])) {
        /** 用户配置对象为空，表示用户没有设置该属性，并且如果defaultsConfig中的属性是对象，深拷贝到config中*/
        config[prop] = merge(defaultsConfig[prop]);
      } else if (typeof defaultsConfig[prop] !== "undefined") {
        /** 用户配置对象为空，且defaultsConfig中该属性不是对象，则直接赋值到config中*/
        config[prop] = defaultsConfig[prop];
      }
    }
  });

  return config;
}
