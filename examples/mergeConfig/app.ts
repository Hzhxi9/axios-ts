import axios from "../../src/axios";
import qs from "qs";

axios.defaults.headers.common["HZX"] = "hello HZX";
axios.defaults.headers.post["HZX1"] = "post HZX";
axios.defaults.headers.get["HZX2"] = "get HZX";

axios({
  url: "/api/mergeConfig",
  method: "post",
  data: qs.stringify({
    a: 1,
  }),
  headers: {
    test: "1235556566",
  },
}).then(res => {
  console.log(res, "===");
});
