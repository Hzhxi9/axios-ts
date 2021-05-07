import axios from "../../src/axios";

/**请求拦截器1 */
const requestInterceptor1 = axios.interceptors.request.use(config => {
  config.headers.text += "requestInterceptor1----";
  return config;
});
/**请求拦截器2 */
const requestInterceptor2 = axios.interceptors.request.use(config => {
  config.headers.text += "requestInterceptor2----";
  return config;
});
/**请求拦截器3 */
const requestInterceptor3 = axios.interceptors.request.use(config => {
  config.headers.text += "requestInterceptor3----";
  return config;
});

/**响应拦截器1 */
const responseInterceptor1 = axios.interceptors.response.use(response => {
  response.headers.text += "响应拦截器1";
  return response;
});
/**响应拦截器2 */
const responseInterceptor2 = axios.interceptors.response.use(response => {
  response.headers.text += "响应拦截器2";
  return response;
});
/**响应拦截器3 */
const responseInterceptor3 = axios.interceptors.response.use(response => {
  response.headers.text += "响应拦截器3";
  return response;
});

axios.interceptors.request.eject(requestInterceptor1);

axios.interceptors.response.eject(responseInterceptor2);

axios.get("/api/getUser", { headers: { text: "Hello" } }).then(res => {
  console.log(res, "===>");
});
