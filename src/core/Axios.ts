import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./interceptorManager";
import mergeConfig from "./mergeConfig";

import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosResponse,
  RejectFn,
  ResolveFn,
} from "../types";

/**存储真实请求数组类型接口 */
interface PromiseArr<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
  rejected?: RejectFn;
}

export default class Axios {
  defaults: AxiosRequestConfig;
  private interceptors: {
    request: InterceptorManager<AxiosRequestConfig>;
    response: InterceptorManager<AxiosResponse<any>>;
  };

  constructor(defaultsConfig: AxiosRequestConfig) {
    this.defaults = defaultsConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse<any>>(),
    };
  }

  request(url: any, config?: any): AxiosPromise {
    /**
     * 当传入的第一个参数url为string类型， 则用户传入的第一个参数是url， 接着判断第二个参数config，如果没传直接赋值{},然后将url赋值到config.url
     * 当传入的第一个参数url不为string类型，则认为用户只传入了一个参数，且该参数就是请求的配置对象config
     */
    if (typeof url === "string") {
      config = config ? config : {};
      config.url = url;
    } else {
      config = url;
    }

    /**合并默认配置和用户配置 */
    config = mergeConfig(this.defaults, config);

    /**实现顺序调用 */
    const arr: PromiseArr<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];

    const { request, response } = this.interceptors;
    /**请求拦截器  先添加后执行，后添加的先执行 */
    request.interceptors.forEach(interceptor => {
      if (interceptor !== null) arr.unshift(interceptor);
    });
    /**响应拦截器  按添加顺序执行 */
    response.interceptors.forEach(interceptor => {
      if (interceptor !== null) arr.push(interceptor);
    });

    /**
     * 链式调用
     * 定义一个已经resolve的promise，循环arr，拿到每个拦截器对象，把它们的resolved和rejected添加到promise.then的参数中完成链式调用
     **/
    let promise = Promise.resolve(config);

    while (arr.length) {
      const { resolved, rejected } = arr.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  _requestMethodWithoutData(
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
      })
    );
  }

  _requestMethodWithData(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
        data,
      })
    );
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, "GET", config);
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, "Delete", config);
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, "HEAD", config);
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, "OPTIONS", config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, "POST", data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, "PUT", data, config);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, "PATCH", data, config);
  }
}
