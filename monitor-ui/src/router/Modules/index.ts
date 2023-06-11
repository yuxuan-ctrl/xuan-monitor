import { RouteObject } from "@/router/interface";

const requireComponent = require.context(
  // 其组件目录的相对路径
  "./",
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /_base\.tsx$/
);

const Modules: Array<RouteObject> = [];

requireComponent.keys().forEach((componentModule: string) => {
  const module = require(`${componentModule}`).default;
  module.forEach((component: RouteObject) => {
    Modules.push(component);
  });
});

export { Modules };
