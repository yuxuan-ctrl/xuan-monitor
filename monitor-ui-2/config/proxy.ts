/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-22 16:11:42
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-22 16:53:58
 * @FilePath: \monitor-ui-2\config\proxy.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    '/api': {
      target: 'http://127.0.0.1:5200/',
      changeOrigin: true,
      pathRewrite: { "^/api": "", },
    },
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api': {
      target: 'http://127.0.0.1:5200/',
      changeOrigin: true,
      pathRewrite: { "^/api": "", },
    },
  },
  pre: {
    '/api': {
      target: 'http://127.0.0.1:5200/',
      changeOrigin: true,
      pathRewrite: { "^/api": "", },
    },
  },
};
