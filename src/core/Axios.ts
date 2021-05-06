import dispatchRequest from "./dispatchRequest";

import { AxiosRequestConfig, AxiosPromise, Method } from "../types";

export default class Axios {
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
    return dispatchRequest(config);
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
