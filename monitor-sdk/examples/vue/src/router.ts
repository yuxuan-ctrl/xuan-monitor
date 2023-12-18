/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-12-18 09:42:37
 * @FilePath: \monitor-sdk\examples\vue\src\router.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import Home from "./views/home.vue";
import Page1 from "./views/page1.vue";
import Page2 from "./views/page2.vue";
import Page3 from "./views/page3.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/page1",
        name: "Page1",
        component: Page1,
      },
      {
        path: "/page2",
        name: "Page2",
        component: Page2,
      },
      {
        path: "/page3",
        name: "Page3",
        component: Page3,
      },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHistory("/"),
});

export default router;
