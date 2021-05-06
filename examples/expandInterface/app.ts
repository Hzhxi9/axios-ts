import axios from "../../src/axios";

axios({
  url: "/api/expandInterface/post",
  method: "POST",
  data: {
    mag: "hi",
  },
});

axios.request({
  url: "/api/expandInterface/post",
  method: "POST",
  data: {
    mag: "hi",
  },
});

axios.get("/api/expandInterface/get");
axios.head("/api/expandInterface/head");
axios.options("/api/expandInterface/options");
axios.delete("/api/expandInterface/delete");

axios.post("/api/expandInterface/post", { msg: "post" });
axios.put("/api/expandInterface/put", { msg: "put" });
axios.patch("/api/expandInterface/patch", { msg: "patch" });
