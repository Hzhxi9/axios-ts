import axios from "../../src/axios";

const url = "/api/handleRequestURL/get";

/**普通参数 */
axios({
  url,
  method: "GET",
  params: {
    a: 1,
    b: 2,
  },
});

/**数组 */
axios({
  url,
  method: "GET",
  params: {
    foo: ["bar", "baz"],
  },
});

/**对象 */
axios({
  url,
  method: "GET",
  params: {
    foo: {
      bar: "baz",
    },
  },
});

/**Date */
const date = new Date();
axios({
  url,
  method: "GET",
  params: {
    date,
  },
});

/**包含特殊字符 */
axios({
  url,
  method: "GET",
  params: {
    foo: "@:%, ",
  },
});

/**undefined || null */
axios({
  url,
  method: "GET",
  params: {
    n: "n",
    a: null,
  },
});

/**存在参数 */
axios({
  url: url + "?foo=foo",
  method: "GET",
  params: {
    a: 1,
    b: 2,
  },
});

/**存在哈希# */
axios({
  url: url + "#hash?bar=baz",
  method: "GET",
  params: {
    a: 1,
    b: 2,
  },
});
