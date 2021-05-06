import axios from "../../src/axios";

axios("/api/addParams", {
  method: "POST",
  data: {
    msg: "两个参数",
  },
});

axios({
  method: "POST",
  url: "/api/addParams",
  data: {
    msg: "一个参数",
  },
});
