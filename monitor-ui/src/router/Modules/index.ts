import React from "react";
const requireComponent = require.context(
  // 其组件目录的相对路径
  "./",
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /_base\.tsx$/
);
console.log(
  "🚀 ~ file: index.tsx:36 ~ requireComponent:",
  requireComponent.keys()
);

const Modules = requireComponent.keys().map((component: string) => {
  console.log("🚀 ~ file: index.ts:17 ~ Modules ~ component:", component);
  console.log(
    "🚀 ~ file: index.ts:17 ~ Modules ~ component:",
    import("./analysis/_base").then((res) => {
      console.log(res);
    })
  );
  console.log(React.lazy(() => import(component.replace(".tsx", ""))));

  console.log(
    "🚀 ~ file: index.ts:17 ~ Modules ~ import(component):",
    import(component.replace(".tsx", ""))
  );
  //   console.log("🚀 ~ file: index.ts:18 ~ Modules ~ component:", require(component))

  return import(component);
});

export {Modules};
