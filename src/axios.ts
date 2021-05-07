import Axios from "./core/Axios";
import defaults from "./defaults";

import { extend } from "./helpers/utils";
import { AxiosInstance, AxiosRequestConfig } from "./types";

/**混合对象 */
function getAxios(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config);

  const axios = Axios.prototype.request.bind(context);

  extend(axios, context);

  return axios as AxiosInstance;
}

const axios = getAxios(defaults);

export default axios;
