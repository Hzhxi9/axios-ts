/**
 *  执行所有转换函数，并且把前一个转换函数的返回值作为参数传给后一个转换函数
 */
import { AxiosTransformer } from "../types";

/**
 *
 * @param data 待转换的data
 * @param headers 待转换的headers
 * @param fns 所有转换函数
 * @returns
 */
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  /**转换函数为空，则不需要转换，直接发返回data */
  if (!fns) return data;

  /**不为数组，包装为数组 */
  if (!Array.isArray(fns)) fns = [fns];

  /**遍历所有转换函数并执行，执行的时候每个转换函数的data会作为下一个转换函数的参数data传入 */
  fns.forEach(f => {
    data = f(data, headers);
  });

  return data;
}
