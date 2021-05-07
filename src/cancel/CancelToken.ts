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
 */