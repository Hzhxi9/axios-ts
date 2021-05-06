import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from "../types/index";
import { parseHeaders } from "../../src/helpers/headers";
import createError from "../../src/helpers/error";

/**封装原生请求 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = "GET", headers, responseType, timeout } = config;

    // 1. 创建XMLHttpRequest异步对象
    const request = new XMLHttpRequest();

    /** 配置超时时间 */
    if (timeout) request.timeout = timeout;

    // 2. 配置请求参数
    url && request.open(method.toUpperCase(), url, true);

    /**捕获请求超时异常 */
    request.ontimeout = function () {
      /**createError 详细超时错误 */
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, "TIMEOUT", request));
    };

    Object.keys(headers).forEach(name => {
      /**当传入的data为null时，此时的Content-Type是没有意义的,此时可以删除 */
      if (data === null && name.toLowerCase() === "content-type") delete headers[name];
      /**添加请求头 */
      request.setRequestHeader(name, headers[name]);
    });

    if (responseType) request.responseType = responseType;

    // 3. 发送请求
    request.send(data);

    /**错误状态处理函数 */
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status <= 300) {
        resolve(response);
      } else {
        /**createError 详细描述状态异常 */
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            response.status,
            response
          )
        );
      }
    }

    // 4. 注册事件,拿到响应信息
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return;

      /**出现网络错误或者超时错误该值为0 */
      if (request.status === 0) return;

      const responseHeaders = parseHeaders(request.getAllResponseHeaders());

      /**
       * responseType没有设置或者设置为text,响应式数据存于request.responseText
       * 其余情况存在于request.response
       */
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

      handleResponse(response);
    };

    /**网络错误 */
    request.onerror = function () {
      /**createError 详细网络错误 */
      reject(createError("New Error", config, null, request));
    };
  });
}
