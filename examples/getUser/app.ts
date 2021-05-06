import axios from "../../src/axios";

interface User {
  name: string;
  age: number;
}
function getUser<T>() {
  return axios({
    url: "/api/getUser",
    method: "GET",
  })
    .then((res) => res)
    .catch((error) => console.log(error));
}

async function userList() {
  const user = await getUser<User>();
  if (user) console.log(user.data);
}

userList()