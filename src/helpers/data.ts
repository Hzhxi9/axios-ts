/**
 * 对request中的data进行转换
 *
 */

import * as Utils from "./utils";

export default function transformRequest(data: any): any {
  if (Utils.isObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
