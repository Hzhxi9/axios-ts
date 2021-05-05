import axios from "../../src/axios";

axios({
  url: "/api/handleRequestBody/post",
  method: "POST",
  data: {
    a: "this is post request",
  },
});
