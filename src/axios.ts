import Axios from "./core/Axios";

import { extend } from "./helpers/utils";
import { AxiosInstance } from "./types";

/**混合对象 */
function getAxios(): AxiosInstance {
  const context = new Axios();

  const axios = Axios.prototype.request.bind(context);

  extend(axios, context);

  return axios as AxiosInstance;
}

const axios = getAxios();

export default axios;
