import serviceInstance from "../../services";

// const res = serviceInstance({
//   url: "/redirectTo", //不用引入，直接在api后面接接口
//   method: "get",
//   data: {},
// });
// console.log(res);
function Home() {
  const setRedirect = async () => {
    const res = await serviceInstance({
      url: "/redirectTo", //不用引入，直接在api后面接接口
      method: "get",
      data: {},
    });
    console.log(res);
  };

  const useFetchSetRedirect = async () => {
    const res = await fetch("/redirectTo", {
      method: "get",
      redirect: "manual",
    });
    console.log(res);
  };

  const useLocationRedirect = () => {
    window.location.href = "http://localhost:8080/redirectTo";
  };
  const useFormData = () => {
    const form = document.createElement("form");
    form.action = "http://localhost:8080/redirectTo";
    document.getElementById("container").appendChild(form);
    form.submit();
    document.getElementById("container").removeChild(form);
  };
  const useSendBeacon = () => {
    navigator.sendBeacon("http://localhost:8080/redirectToPost");
  };
  const testThirdCookie = () => {
    window.location.href = "http://testxuan.baidu.com:8080/setCookieRedirect";
  };
  const getSpaService = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/login", true);
    // xhr.setRequestHeader("Accept", "application/json, text/plain, */*"); //404的罪魁祸首，Accept 表示请求方希望的资源类型，或者能解析识别的类型
    xhr.setRequestHeader("Content-Type", "application/json"); // 无关，Content-Type 表示实际发送的资源类型
    xhr.send();
    xhr.onreadystatechange = function () {
      console.log(xhr);
    };
  };
  return (
    <div id="container">
      <button onClick={setRedirect}>测试Axios重定向</button>
      <button onClick={useFetchSetRedirect}>测试Fetch重定向</button>
      <button onClick={useLocationRedirect}>测试location重定向</button>
      <button onClick={useFormData}>测试Form表单重定向</button>
      <button onClick={useSendBeacon}>测试SendBeacon重定向</button>
      <button onClick={testThirdCookie}>测试第三方Cookie</button>
      <button onClick={testThirdCookie}>测试第三方Cookie</button>
      <button onClick={getSpaService}>测试获取本系统页面</button>
    </div>
  );
}

export default Home;
