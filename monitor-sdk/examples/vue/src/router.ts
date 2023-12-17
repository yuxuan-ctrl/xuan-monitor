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
  history: createWebHashHistory("/"),
});

export default router;
