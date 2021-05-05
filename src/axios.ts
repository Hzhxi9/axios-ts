import { AxiosRequestConfig } from "./types/index";

import xhr from "./xhr";
import buildURL from "./helpers/buildURL";
import transformRequest from "./helpers/data";

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config);
  config.data = transformRequestData(config);
}

/**用于GET */
function transformURL(config: AxiosRequestConfig): string {
  const { params, url } = config;
  return buildURL(url, params);
}

/**用于POST */
function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config;
  return transformRequest(data);
}

function axios(config: AxiosRequestConfig) {
  processConfig(config);
  xhr(config);
}

export default axios;
