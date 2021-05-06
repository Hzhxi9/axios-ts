import { AxiosRequestConfig, AxiosResponse } from "../types";

/**异常信息类，继承内置Error，并扩展config，request，code，response等属性 */
export class AxiosError extends Error {
  private config: AxiosRequestConfig;
  private request?: any;
  private code?: number | null | string;
  private response?: AxiosResponse;

  constructor(
    message: string,
    config: AxiosRequestConfig,
    request?: any,
    code?: string | null | number,
    response?: AxiosResponse
  ) {
    super(message);

    this.config = config;
    this.request = request;
    this.code = code;
    this.response = response;

    Object.setPrototypeOf(this, AxiosError.prototype);
  }
}

/**快速创建AxiosError类实例的工厂方法 */
export default function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null | number,
  request?: any,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response);
  return error;
}
