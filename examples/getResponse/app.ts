import axios from "../../src/axios";

axios({
  url: "/api/getResponse",
  method: "POST",
  data: {
    a: 1,
    n: "n",
  },
}).then(res => {
  console.log(res);
});

axios({
  url: "/api/getResponse",
  method: "POST",
  responseType: "json",
  data: {
    a: 1,
    n: "n",
  },
}).then(res => {
  console.log(res);
});
