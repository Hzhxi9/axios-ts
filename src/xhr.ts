import { AxiosRequestConfig } from "./types/index";

/**封装原生请求 */
export default function xhr(config: AxiosRequestConfig) {
  const { data = null, url, method = "GET", headers } = config;

  const request = new XMLHttpRequest();

  request.open(method.toUpperCase(), url, true);

  Object.keys(headers).forEach(name => {
    /**当传入的data为null时，此时的Content-Type是没有意义的,此时可以删除 */
    if (data === null && name.toLowerCase() === "content-type") delete headers[name];
    /**添加请求头 */
    request.setRequestHeader(name, headers[name]);
  });

  request.send(data);
}
