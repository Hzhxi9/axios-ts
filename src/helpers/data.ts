import * as Utils from "./utils";

/**
 * 对request中的data进行转换
 */
export default function transformRequest(data: any): any {
  if (Utils.isObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

/**将字符串转换为对象形式 */
export function transformResponse(data: any): any {
  if (Utils.isString(data)) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  }
  return data;
}
