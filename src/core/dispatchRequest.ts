import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types/index";

import xhr from "./xhr";
import buildURL from "../helpers/buildURL";
import transform from "../core/transform";
import processHeaders, { flattenHeaders } from "../helpers/headers";

/**处理config */
function processConfig(config: AxiosRequestConfig) {
  /**合并url */
  config.url = transformURL(config);
  /**处理headers */
  config.headers = transformHeaders(config);
  /**处理data */
  config.data = transform(config.data, config.headers, config.transformRequest);
  /**扁平化headers */
  config.headers = flattenHeaders(config.headers, config.method!);
}

/**处理请求返回的data */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
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

/**转换为Promise */
function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then((res: AxiosResponse) => transformResponseData(res));
}

export default axios;
