import axios from "../../src/axios";

/**默认请求头 */
axios({
  method: "POST",
  url: "/api/handleRequestHeader/post",
  data: {
    a: 1,
    b: 1,
  },
});

/**扩展请求头 */
axios({
  method: "POST",
  url: "/api/handleRequestHeader/post",
  headers: {
    "content-type": "application/json;charset=UTF-8",
    Accept: "application/json,text/plain,*/*",
  },
  data: {
    a: 1,
    b: 1,
  },
});

/** URLSearchParams*/
const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams = new URLSearchParams(paramsString);

console.log("=====", searchParams);
axios({
  method: "POST",
  url: "/api/handleRequestHeader/post",
  data: searchParams,
});
