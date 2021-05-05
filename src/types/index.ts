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
}
