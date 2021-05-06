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
  url?: string;
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

/**异常信息接口类型 */
export interface AxiosError extends Error {
  /**请求配置对象 */
  config: AxiosRequestConfig;
  /**错误码 */
  code: string | null | number;
  /**请求的 XMLHttpRequest 对象实例*/
  request: any;
  /**服务端响应数据 */
  response: AxiosResponse;
}

/**继承Promise */
export interface AxiosPromise extends Promise<AxiosResponse> {}

/**定义Axios类类型接口,扩展Axios内置方法以及属性 */
export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise;

  get(url: string, config?: AxiosRequestConfig): AxiosPromise;

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise;

  head(url: string, config?: AxiosRequestConfig): AxiosPromise;

  options(url: string, config?: AxiosRequestConfig): AxiosPromise;

  /**添加data */
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
}

/**混合Axios类 */
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise;
  /**重载的函数类型 */
  (url: string, config?: any): AxiosPromise;
}
