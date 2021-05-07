import { RejectFn, ResolveFn } from "../types";

/**拦截类接口 */
interface Interceptor<T> {
  resolved: ResolveFn<T>;
  rejected?: RejectFn;
}

/**
 * 拦截类
 *
 * 拦截器调用顺序
 *  请求拦截器  先添加后执行，后添加的先执行
 *  响应拦截器  按添加顺序执行
 *  请求拦截器调用完后，再调用响应拦截器。
 */

export default class InterceptorManager<T> {
  /**存放创建所有拦截器的数组 */
  public interceptors: Array<Interceptor<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  /**添加use方法 */
  use(resolved: ResolveFn<T>, rejected?: RejectFn): number {
    this.interceptors.push({
      resolved,
      rejected,
    });
    /**返回该对象的索引作为该拦截器的id */
    return this.interceptors.length - 1;
  }

  /**添加eject */
  eject(id: number): void {
    /**
     * 不使用slice方法删除是因为确保数组的长度不发生改变，从而保证拦截器在数组的索引的唯一性
     * 后续只需要判断拦截器是否为null
     */
    if (this.interceptors[id]) this.interceptors[id] = null;
  }
}
