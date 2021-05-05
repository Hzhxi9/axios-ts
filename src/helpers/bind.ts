export function bind(fn: any, thisArg: any) {
  return function warp() {
    const args = new Array(arguments.length);
    for (let i = 0, len = args.length; i < len; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}
