export default class Cancel {
  message: string;
  /**
   * 实例化一个取消原因对象，该对象的message属性就是请求的取消原因
   * @param message 
   */
  constructor(message: string) {
    this.message = message;
  }
}
