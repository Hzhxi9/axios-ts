const bind = require("./bind");

const toStringProp = Object.prototype.toString;

/**
 * 判断是否数组
 */
export function isArray(val: unknown) {
  return toStringProp.call(val) === "[object Array]";
}

/**
 * 判断是否undefined
 */
export function isUndefined(val: unknown) {
  return typeof val === "undefined";
}

/**
 * 判断是否缓冲器
 * Buffer Node.js提供的一个二进制缓冲区，常用来处理I/O操作
 * url: http://nodejs.cn/api/buffer.html
 */
export function isBuffer(val: any) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    typeof val.constructor.isBuffer === "function" &&
    val.constructor.isBuffer(val)
  );
}

/**
 *  判断是否ArrayBuffer
 *  前端的一个通用的二进制缓冲区，类似数组
 *  url: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
 */
export function isArrayBuffer(val: unknown) {
  return toStringProp.call(val) === "[object ArrayBuffer]";
}

/**
 * 判断是否Blob
 * 前端的一个专门用于支持文件操作的二进制对象
 */
export function isBlob(val: unknown) {
  return toStringProp.call(val) === "[object Blob]";
}

/**
 * 判断是否FormData
 * 一种表示表单数据的键值对 key/value 的构造方式，并且可以轻松的将数据通过XMLHttpRequest.send() 方法发送出去
 */
export function isFormData(val: unknown) {
  return toStringProp.call(val) === "[object FromData]";
}

/**
 *  判断是否ArrayBufferView
 */
export function isArrayBufferView(val: any) {
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    return ArrayBuffer.isView(val);
  } else {
    return val && val.buffer && val instanceof ArrayBuffer;
  }
}

/**
 * 判断是否string
 */
export function isString(val: unknown) {
  return typeof val === "string";
}

/**
 * 判断是否number
 */
export function isNumber(val: unknown) {
  return typeof val === "number";
}

/**
 * 判断是否object
 */
export function isObject(val: unknown): val is Object {
  return typeof val === "object" && val !== null;
}

/**
 * 判断是否普通对象
 */
export function isPlainObject(val: unknown) {
  if (toStringProp.call(val) !== "[object Object]") return false;

  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * 判断是否Date
 */
export function isDate(val: unknown): val is Date {
  return toStringProp.call(val) === "[object Date]";
}

/**
 * 判断是否File
 */
export function isFile(val: unknown) {
  return toStringProp.call(val) === "[object File]";
}

/**
 * 判断是否function
 */
export function isFunction(val: any) {
  return toStringProp.call(val) === "[object Function]";
}

/**
 * 判断是否Stream
 */
export function isStream(val: any) {
  return toStringProp.call(val) && isFunction(val.pipe);
}

/**
 * 判断是否URLSearchParams
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
  return !isUndefined(URLSearchParams) && val instanceof URLSearchParams;
}

/**
 * 去除前后空格
 */
export function trim(str: string) {
  return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**
 * 判断是否能在标准浏览器环境运行
 *
 * 运行在web work 与 react-native, 这两种环境都支持XMLHttpRequest， 但不完全支持global环境
 *
 * web work:
 *     typeof window ==> undefined
 *     typeof document ==> undefined
 *
 * react-native
 *     navigator.product ==> 'ReactNative'
 *
 * nativescript
 *     navigator.produce ==> 'NativeScript' or 'NS'
 *
 */
export function isStandardBrowserEnv() {
  if (
    typeof navigator !== "undefined" &&
    (navigator.product === "ReactNative" ||
      navigator.product === "NativeScript" ||
      navigator.product === "NS")
  ) {
    return false;
  }

  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * 手写forEach
 */
export function forEach(
  o: any,
  f: { (val: any, key: any): void; (val: any, key: any): void; call?: any }
) {
  if (o === null || isUndefined(o)) return;

  /**
   * 如果不为对象,包装为数组
   */
  if (!isObject(o)) o = [o];

  if (Array.isArray(o)) {
    const len = o.length >>> 0;
    let k = 0;
    while (k < len) {
      f.call(null, o[k], k, o);
      k++;
    }
  } else {
    for (const key in o) {
      if (Object.prototype.hasOwnProperty.call(o, key)) f.call(null, o[key], key, o);
    }
  }
}

/**
 *  合并对象的属性，相同属性后面的替换前的
 *
 *   const a = { name: "zz", option: { value: "123", isShow: true } };
 *   const b = { age: 12, option: { data: "5666", isOpen: false } };
 *   console.log(marge(a, b));
 */

export function merge(...args: any[]) {
  let result = Object.create(null);

  function assignValue(val: any, key: string | number) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      /**
       *  当result[key]为对象，val也为对象，深拷贝
       */
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      /**
       *  属性是对象时，深拷贝该属性值
       */
      result[key] = merge({}, val);
    } else if (Array.isArray(val)) {
      /**
       *  属性是数组时，复制数组给result[key]
       */
      result[key] = val.slice();
    } else {
      /**
       *  属性为原始值
       */
      result[key] = val;
    }
  }

  for (let i = 0, len = arguments.length; i < len; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}

/**
 * 扩展对象 将 b 里面的属性和方法继承给 a , 并且将 b 里面的方法的执行上个下文都绑定到 thisArg
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}

/**
 * BOM移除
 *  对于UTF8来说，BOM的有无并不是必须的，因为UTF8字节没有顺序，不需要标记，也就是说一个UTF8文件可能有BOM，也可能没有BOM。
 *  根据不同编码的BOM不同，我们可以根据文件头几个字节来判断文件是否包含BOM，以及使用的那种Unicode编码。
 *  BOM字符虽然起到了标记文件编码的作用，其本身却不属于文件内容的一部分，如果读取文本文件时不去掉BOM，在某些使用场景下就会有问题。例如我们把几个JS文件合并成一个文件后，如果文件中间含有BOM字符，就会导致浏览器JS语法错误。因此，使用Node.js读取文本文件时，一般需要去掉BOM。
 */
export function stripBOM(content: string) {
  /**
   * 检测第一个字符是否为BOM
   */
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(0);
  }
  return content;
}

/**判断对象是否存在键 */
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}
