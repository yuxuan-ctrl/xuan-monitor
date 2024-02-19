/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 16:55:56
 * @FilePath: \monitor-ui\src\setupProxy.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://127.0.0.1:5200/" /*这里写自己的代理地址*/,
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
