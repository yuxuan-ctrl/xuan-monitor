import React from "react";
import serviceInstance from "../../services";

const res = serviceInstance({
  url: "/getUserById/1", //不用引入，直接在api后面接接口
  method: "get",
  data: {},
});
console.log(res);

function Login() {
  return <div>111</div>;
}

export default Login;
