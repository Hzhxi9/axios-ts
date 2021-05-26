/**
 * 第一种
 *    可以使用CancelToken工厂创建取消令牌
 *
 * 第二种
 *    通过将取消函数传递给CancelToken的构造函数来创建取消令牌
 *
 * 取消令牌就是请求配置对象中的一个属性，该属性对应一个取消请求的触发函数，
 * 当在请求外部调用该触发函数，表示此时需要取消请求了
 * 那么此时调用XMLHttpRequest对象上的abort方法将请求取消即可
 *
 * 设计思路
 *  axios 混合对象增加一个静态接口CancelToken
 *  CancelToken 接口是一个类
 *  CancelToken 类的构造函数接收一个函数作为参数
 *  并且这个参数函数也接收一个取消函数作为参数
 *  CancelToken类上有个静态方法source
 *  source方法返回一个对象：token和cancel
 *  source.token就是Cancel类的实例
 *  source.cancel就是取消请求触发函数
 *  axios混合对象增加一个静态接口isCancel
 *  isCancel接口接收错误对象e作为参数，用来判断该错误是不是由取消请求导致的
 *
 *
 *  完善取消请求功能
 *  有两个请求，请求一和请求二，这两个请求都受某个条件影响
 *  也就是说当这个条件成立时，这两个请求都会被取消
 *  亦或者说当请求一发出后，此时突然该条件成立了那么立即取消了请求一
 *  而接下来请求二就不要在发了
 *  而不是说请求而照样发出
 *  只不过发出后被取消
 *
 *  请求一和请求二都受某个条件影响，请求一发出后一秒该条件突然成立随即取消请求
 *  而1.5秒后请求2秒照样发出，接着被取消。这样会造成资源浪费。所以直接请求二不发送。
 *
 *  优化
 *  在发送请求前加条件判断
 *  首先判断当前是否配置了cancelToken，其次在判断取消原因reason是否存在
 *  若如果存在说明这个cancelToken已经被使用过了
 *  我们就不发送这个请求了
 *  直接抛出异常即可
 *  并且抛异常的信息就是我们取消的原因
 */

import {
  Canceler,
  CancelExecutor,
  CancelTokenSource,
  CancelTokenStatic,
} from "../types";

import Cancel from "./Cancel";

interface ResolvePromise {
  (reason: Cancel): void;
}

export default class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise;
    /**
     * 在CancelToken构造函数内部，首先实例化一个pending状态的Promise对象
     * 然后用一个resolvePromise变量指向resolve函数
     */
    this.promise = new Promise<Cancel>((resolve) => {
      resolvePromise = resolve;
    });
    /**
     * 接着执行executor函数，该函数接收的参数是cancel函数
     *
     * cancel函数就是将来取消触发函数
     * 当外部调用了cancel函数，在cancel函数内部，会调用resolvePromise把Promise对象从pending状态变为resolved状态，然后就会执行then函数，
     * 在then函数内部调用XMLHttpRequest对象上的abort()方法取消请求
     */
    executor((message) => {
      if (this.reason) {
        return;
      }
      if (message) {
        this.reason = new Cancel(message);

        this.reason && resolvePromise(this.reason);
      }
    });
  }

  /**
   * 该方法用来判断取消原因reason是否存在
   * 如果存在则直接抛出异常
   * 并且把取消原因作为异常信息
   * 
   * 在发送请求前做次判断，判断是否配置了cancelToken
   * 如果配置了进而再调用throwIfRequested方法判断取消原因是否存在
   */
  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * 第一种方式source
   *
   * 将第二种方式的显示实例化CancelToken类挪到类里面
   * 并且把cancel变量也挪到里面来
   * 然后分别把实例对象赋给token，触发函数赋给cancel
   * 一并返回出去，在外面使用
   */
  static source(): CancelTokenSource {
    let cancel!: Canceler;
    let token = new CancelToken((c) => {
      cancel = c;
    });

    return {
      cancel,
      token,
    };
  }
}
