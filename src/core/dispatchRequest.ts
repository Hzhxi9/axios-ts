import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
} from "../types/index";

import xhr from "./xhr";
import buildURL from "../helpers/buildURL";
import transform from "../core/transform";
import processHeaders, { flattenHeaders } from "../helpers/headers";

/**处理config */
function processConfig(config: AxiosRequestConfig) {
  /**合并url */
  config.url = transformURL(config);
  /**处理headers */
  // config.headers = transformHeaders(config);
  /**处理data */
  config.data = transform(config.data, config.headers, config.transformRequest);
  /**扁平化headers */

  config.headers = flattenHeaders(config.headers, config.method!);
}

/**用于GET */
function transformURL(config: AxiosRequestConfig): string | undefined {
  const { params, url } = config;
  if (url) {
    return buildURL(url, params);
  }
}

/**处理headers */
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

/**处理请求返回的data */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

/**转换为Promise */
function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config);
  processConfig(config);
  return xhr(config).then((res: AxiosResponse) => transformResponseData(res));
}

/**
 * 入股已经请求取消 则抛出异常 
 * 发送请求前检查一下配置的cancelToken 是否已经使用过了
 * 如果已经被用过则不用请求，直接抛异常
 **/
function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

export default dispatchRequest;
