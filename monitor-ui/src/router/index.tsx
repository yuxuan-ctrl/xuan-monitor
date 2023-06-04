// 引入所需的依赖文件
import * as React from "react";
import { useRoutes } from "react-router-dom";
// 引入所需要路由的页面
const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/login"));

export default function GetRoutes() {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "Login",
      element: <Login />,
    },
  ]);
  return element;
}
