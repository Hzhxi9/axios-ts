import axios from "../../src/axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("/api/throwIfRequested", {
    cancelToken: source.token,
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log(`请求取消原因：${error.message}`);
    }
  });

setTimeout(() => {
  source.cancel("Operation canceled by the user");
}, 1000);

setTimeout(() => {
  axios
    .get("/api/throwIfRequested", {
      cancelToken: source.token,
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        console.log(`请求取消原因：${e.message}`);
      }
    });
}, 1500);
