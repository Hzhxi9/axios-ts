import axios from "../../src/axios";

axios({
  method: "GET",
  url: "/api/base/get",
  params: {
    a: 1,
    b: 2,
  },
});
