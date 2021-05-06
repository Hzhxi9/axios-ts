import axios from "../../src/axios";

/**正常情况 */
axios({
  url: "/api/handleError",
  method: "GET",
})
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err, "正常情况");
  });

/**url写错 */
axios({
  url: "/api/handleError1",
  method: "GET",
})
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err, "url写错");
  });

/**模拟网络错误 */
setTimeout(() => {
  axios({
    url: "/api/handleError",
    method: "GET",
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err, "模拟网络错误");
    });
}, 5000);

/**配置请求超时时间为2秒,模拟请求超时 */
axios({
  url: "/api/handleError/timeout",
  method: "GET",
  timeout: 2000,
})
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err, "配置请求超时时间为2秒");
  });
