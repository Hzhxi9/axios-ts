import Axios from "./core/Axios";
import defaults from "./defaults";
import CancelToken from "./cancel/CancelToken";
import Cancel from "./cancel/Cancel";
import isCancel from "./cancel/isCancel";
import mergeConfig from "./core/mergeConfig";

import { extend } from "./helpers/utils";
import { AxiosRequestConfig, AxiosStatic } from "./types";

/**混合对象 */
function getAxios(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);

  const axios = Axios.prototype.request.bind(context);

  extend(axios, context);

  return axios as AxiosStatic;
}

const axios = getAxios(defaults);

/**
 *  接口接收一个AxiosRequestConfig类型的配置对象
 *  把该配置对象和全局默认配置对象进行合并
 *  作为将来返回的新axios实例对象的默认配置
 *  最后使用getAxios创建一个新的实例对象返回
 */
axios.create = function (config: AxiosRequestConfig) {
  return getAxios(mergeConfig(defaults, config));
};

axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

export default axios;
