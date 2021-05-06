/**只能传入合法的字符串 */
export type Method =
  | "get"
  | "GET"
  | "delete"
  | "Delete"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH";

export interface AxiosRequestConfig {
  /**请求地址 */
  url: string;
  /**请求的HTTP方法 */
  method?: Method;
  /**请求头 */
  headers?: any;
  /**POST,PATCH等类型请求的数据,放到request body中 */
  data?: any;
  /**GET,HEAD等类型请求的数据,拼接到url的query string中 */
  params?: any;
  /**指定响应数据的类型 */
  responseType?: XMLHttpRequestResponseType;
  /**超时时间 请求发送后超过某个时间后仍然没收到响应，则请求自动终止，并会触发 XMLHttpRequest 对象实例的 ontimeout 事件。 */
  timeout?: number;
}

/**服务端响应的数据接口类型 */
export interface AxiosResponse {
  /**服务端返回的数据 */
  data: any;
  /**HTTP 状态码 */
  status: number;
  /**状态消息 */
  statusText: string;
  /**响应头 */
  headers: any;
  /**请求配置对象 */
  config: AxiosRequestConfig;
  /**请求的 XMLHttpRequest 对象实例*/
  request: any;
}

/**继承Promise */
export interface AxiosPromise extends Promise<AxiosResponse> {}
