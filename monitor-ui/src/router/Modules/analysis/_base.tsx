/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-09 09:21:40
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-20 14:58:49
 * @FilePath: \monitor-ui\src\router\Modules\analysis\_base.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React from "react";
import lazyLoad from "@/router/utils/lazyLoad";
import {RouteObject} from "@/router/interface";

// 外部链接模块
const analysisRouter: Array<RouteObject> = [
  {
    meta: {
      title: "分析模块",
      icon: "",
    },
    children: [
      {
        path: "/analysis/dataAnalysis",
        element: lazyLoad(
          React.lazy(() => import("@/pages/analysis/dataAnalysis"))
        ),
        meta: {
          requiresAuth: true,
          title: "数据分析",
          key: "dataAnalysis",
          icon: "",
        },
      }
    ],
  },
];

export default analysisRouter;
