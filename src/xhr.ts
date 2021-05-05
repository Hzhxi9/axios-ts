import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from "./types/index";

/**封装原生请求 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = "GET", headers, responseType } = config;

    // 1. 创建XMLHttpRequest异步对象
    const request = new XMLHttpRequest();

    // 2. 配置请求参数
    request.open(method.toUpperCase(), url, true);

    Object.keys(headers).forEach(name => {
      /**当传入的data为null时，此时的Content-Type是没有意义的,此时可以删除 */
      if (data === null && name.toLowerCase() === "content-type") delete headers[name];
      /**添加请求头 */
      request.setRequestHeader(name, headers[name]);
    });

    if (responseType) request.responseType = responseType;

    // 3. 发送请求
    request.send(data);

    // 4. 注册事件,拿到响应信息
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return;

      const responseHeaders = request.getAllResponseHeaders();

      const responseData =
        responseType && responseType !== "text" ? request.response : request.responseText;

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      };

      resolve(response);
    };

    request.onerror = function (error) {
      reject(error);
    };
  });
}
