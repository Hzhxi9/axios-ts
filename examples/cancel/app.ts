import axios from "../../src/axios";
import { Canceler } from "../../src/types";

const CancelToken = axios.CancelToken;

let cancel: Canceler;

axios
  .get("/api/cancel", {
    /**
     * 用户配置了cancelToken属性，该属性的属性值是CancelToken类的实例
     */
    cancelToken: new CancelToken((c) => {
      /**
       * 实例化CancelToken类时，会执行类的构造函数，我们为构造函数传入一个executor函数
       * 该函数接收一个参数，并把这个参数赋给变量cancel
       * 
       * 在构造函数内部，首先实例化了一个pending状态的Promise对象，然后用一个resolve变量指向resolve函数
       * 
       * 接着执行了传入的executor函数，执行executor函数的时候为其传入了一个参数
       * 
       * 执行了executor函数，该函数会把这个参数赋给变量cancel
       * 
       * 变量cancel就是将来的请求取消触发函数，当外部取消请求时就会调用cancel函数
       * 在cancel函数内部会调用resolvePromise把Promise对象从pending状态变为resolved状态
       * 也就是说把CancelToken类中this.promise变成了resolved状态
       * 
       * 而请求配置对象中的cancelToken属性是CancelToken类的实例对象
       * 那么他自然能访问类里面的promise，当这个属性的状态变成了resolved时，表明有人在外部调用了cancel
       * 
       * 如果没有调用cancel函数，那么cancelToken.promise的状态就是一直是pending
       * 就不能调用then方法，就不能取消请求了。
       */
      cancel = c;
    }),
  })
  .catch((error) => {
    console.log(error);
  });

setTimeout(() => {
  cancel("Operation canceled by the user");
}, 1000);
