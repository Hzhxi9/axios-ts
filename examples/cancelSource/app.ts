import axios from "../../src/axios";

import { Canceler } from "../../src/types";

const CancelToken = axios.CancelToken;

const source = CancelToken.source();

axios
  .get("/api/cancelSource", {
    cancelToken: source.token,
  })
  .catch(function (e) {
    console.log(e);
  });

setTimeout(() => {
  source.cancel("Operation canceled by the user");
},1000);
