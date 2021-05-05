import { AxiosRequestConfig } from "./types/index";

/**封装原生请求 */
export default function xhr(config: AxiosRequestConfig) {
  const { data = null, url, method = "GET" } = config;

  const request = new XMLHttpRequest();

  request.open(method.toUpperCase(), url, true);

  request.send(data);
}
