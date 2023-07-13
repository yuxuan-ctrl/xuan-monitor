/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-30 10:38:52
 * @FilePath: \monitor-ui\src\pages\home\index.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import serviceInstance from "../../services";

// const res = serviceInstance({
//   url: "/redirectTo", //不用引入，直接在api后面接接口
//   method: "get",
//   data: {},
// });
// console.log(res);
function Home() {
  const setRedirect = () => {
    const res = serviceInstance({
      url: "/redirectTo", //不用引入，直接在api后面接接口
      method: "get",
      data: {},
      headers: {
        Accept: "*/*",
      },
    });
    console.log(res);
  };

  const useFetchSetRedirect = async () => {
    const res = await fetch("/redirectTo",{
      method: "get",
      redirect:'manual'
    });
    console.log(res);
  };

  const useLocationRedirect = () => {
    window.location.href = "http://localhost:8080/redirectTo"
  };
  const useFormData = ()=>{
    const form = document.createElement("form");
    form.action = "http://localhost:8080/redirectTo";
    document.getElementById("container").appendChild(form);
    form.submit();
    document.getElementById("container").removeChild(form);
  }
  const useSendBeacon = ()=>{
    navigator.sendBeacon("http://localhost:8080/redirectToPost")
  }
  const testThirdCookie = ()=>{
    window.location.href = "http://testxuan.baidu.com:8080/setCookieRedirect"
  }
  return (
    <div id="container">
      <button onClick={setRedirect}>测试Axios重定向</button>
      <button onClick={useFetchSetRedirect}>测试Fetch重定向</button>
      <button onClick={useLocationRedirect}>测试location重定向</button>
      <button onClick={useFormData}>测试Form表单重定向</button>
      <button onClick={useSendBeacon}>测试SendBeacon重定向</button>
      <button onClick={testThirdCookie}>测试第三方Cookie</button>
    </div>
  );
}

export default Home;
