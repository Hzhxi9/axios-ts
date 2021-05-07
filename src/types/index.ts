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

/**请求配置config类型 */
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

/**
 * 服务端响应的数据接口类型
 * 添加泛型参数,精确指定响应返回的data的类型
 **/
export interface AxiosResponse<T = any> {
  /**服务端返回的数据 */
  data: T;
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
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

/**定义Axios类类型接口,扩展Axios内置方法以及属性 */
export interface Axios {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse<any>>;
  };

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;

  /**添加data */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}

/**混合Axios类 */
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
  /**重载的函数类型 */
  <T = any>(url: string, config?: any): AxiosPromise<T>;
}
/**
 * axios请求和响应拦截器
 *
 * 请求拦截器在每个请求发送之前为请求做一些额外的东西
 * 例如可以在请求拦截器中为所有的请求添加token认证等信息，添加后在发出去
 *
 * 响应拦截器在每个请求响应回来之后可以对其进行一道预处理，处理之后再将响应返回给真正的请求
 */

/**
 * 拦截器类型接口
 * T: 创建的是请求拦截器还是响应拦截器对应传入的AxiosRequestConfig或者AxiosResponse
 **/
export interface AxiosInterceptorManager<T> {
  /**
   * 添加拦截器
   * 返回一个创建拦截器的id,用于标识拦截器
   **/
  use(resolve: ResolveFn<T>, reject?: RejectFn): number;
  /**
   * 删除拦截器
   * 接收拦截器的id作为参数，用来表明删除哪个拦截器
   **/
  eject(id: number): void;
}

/**
 * resolve函数的参数在请求拦截器和响应拦截器有所不同
 * 请求拦截器中参数是请求的配置对象config，类型是AxiosRequestConfig
 * 响应拦截器中参数是响应对象response，类型是AxiosResponse
 */
export interface ResolveFn<T> {
  (val: T): T | Promise<T>;
}

export interface RejectFn {
  (error: any): any;
}
