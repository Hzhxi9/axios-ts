import Cancel from "./Cancel";

/**
 * 该函数异常对象是不是取消原因对象 返回true或者false
 * @param val 
 * @returns 
 */
export default function isCancel(val: any): boolean {
  return val instanceof Cancel;
}
