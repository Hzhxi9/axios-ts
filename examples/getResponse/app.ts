import axios from "../../src/axios";

axios({
  url: "/api/getResponse",
  method: "post",
  data: {
    a: 1,
    n: "n",
  },
}).then(res => {
  console.log(res);
});

axios({
  url: "/api/getResponse",
  method: "post",
  responseType: "json",
  data: {
    a: 1,
    n: "n",
  },
}).then(res => {
  console.log(res);
});
