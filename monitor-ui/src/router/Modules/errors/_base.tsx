/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-09 09:21:40
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-20 15:26:28
 * @FilePath: \monitor-ui\src\router\Modules\errors\_base.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from "react";
import lazyLoad from "@/router/utils/lazyLoad";
import {RouteObject} from "@/router/interface";

// 外部链接模块
const errorsRouter: Array<RouteObject> = [
  {
    meta: {
      title: "错误模块",
      icon: "",
    },
    children: [
      {
        path: "/errors/list",
        element: lazyLoad(React.lazy(() => import("@/pages/errors/list"))),
        meta: {
          requiresAuth: true,
          title: "错误列表",
          key: "errorList",
          icon: "",
        },
      },
      {
        path: "/errors/details/:id",
        element: lazyLoad(React.lazy(() => import("@/pages/errors/details"))),
        meta: {
          requiresAuth: true,
          title: "错误详情",
          key: "errorDetails",
          icon: "",
          notShow: true,
        },
      },
    ],
  },
];

export default errorsRouter;
