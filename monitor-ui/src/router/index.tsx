/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-09 10:57:07
 * @FilePath: \monitor-ui\src\router\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-06-08 17:10:21
 * @FilePath: \monitor-ui\src\router\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 引入所需的依赖文件
import * as React from "react";
import {useRoutes, Navigate} from "react-router-dom";
import {RouteObject} from "@/router/interface";
import {Modules} from "./Modules";
console.log("🚀 ~ file: index.tsx:26 ~ Modules:", Modules);
// console.log("🚀 ~ file: index.tsx:26 ~ routeArray:", routeArray);

// * 导入所有router
// const metaRouters = import.meta.globEager("./modules/*.tsx");

// * 处理路由
// export const routerArray: RouteObject[] = [];
// Object.keys(metaRouters).forEach(item => {
// 	Object.keys(metaRouters[item]).forEach((key: any) => {
// 		routerArray.push(...metaRouters[item][key]);
// 	});
// });

// 引入所需要路由的页面
const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/login"));

// export default function GetRoutes() {
//   const element = useRoutes([
//     {
//       path: "/home",
//       element: <Home />,
//     },
//     {
//       path: "/login",
//       element: <Login />,
//       meta: {
//         requiresAuth: false,
//         title: "登录页",
//         key: "login"
//       }
//     },
//   ]);
//   return element;
// }
export const rootRouter: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      requiresAuth: false,
      title: "登录页",
      key: "login",
    },
  },
  {
    path: "/home",
    element: <Home />,
    meta: {
      requiresAuth: false,
      title: "首页",
      key: "home",
    },
  },
  ...Modules,
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];
console.log("🚀 ~ file: index.tsx:88 ~ rootRouter:", rootRouter);

const Router = () => {
  const routes = useRoutes(rootRouter);
  return routes;
};

export default Router;
