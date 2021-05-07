/**
 * 默认配置对象
 *
 * 添加默认请求超时时间和请求头,并且在headers中设置了common属性，用于存放所有请求都需要的请求头字段
 * 另外在common同级下创建每个请求方式属性，用于存放不同请求所特有的请求头字段
 * 例如需要数据的请求方式post、put、patch默认添加Content-Type
 * 不需要数据的请求get、delete、head、options则留空
 **/

import { AxiosRequestConfig } from "./types";

const defaults: AxiosRequestConfig = {
  timeout: 0,
  headers: {
    common: {
      Accept: "application/json,text/plain,*/*",
    },
  },
};

const methodsNoData = ["delete", "get", "head", "options"];

methodsNoData.forEach(method => {
  defaults.headers[method] = {};
});

const methodsWithData = ["post", "put", "patch"];

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
});

export default defaults;
