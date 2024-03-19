/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-22 16:11:42
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-03-19 18:17:38
 * @FilePath: \monitor-ui-2\config\routes.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: './dashboard/analysis',
      },
      {
        name: 'analysis',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
      {
        name: 'region',
        icon: 'smile',
        path: '/dashboard/region',
        component: './dashboard/region',
      },
      // ,
      // {
      //   name: 'monitor',
      //   icon: 'smile',
      //   path: '/dashboard/monitor',
      //   component: './dashboard/monitor',
      // },
      // {
      //   name: 'workplace',
      //   icon: 'smile',
      //   path: '/dashboard/workplace',
      //   component: './dashboard/workplace',
      // },
    ],
  },
  {
    path: '/errors',
    name: 'errors',
    icon: 'crown',
    access: false,
    routes: [
      {
        path: '/errors',
        redirect: '/errors/list',
      },
      {
        path: '/errors/list',
        name: 'errors-list',
        component: './Errors',
      },
      {
        path: '/errors/details',
        name: 'errors-details',
        component: './Errors/details',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/users',
    name: 'users',
    icon: 'crown',
    access: false,
    routes: [
      {
        path: '/users',
        redirect: '/users/list',
      },
      {
        path: '/users/list',
        name: 'users-list',
        component: './Users',
      },
      {
        path: '/users/details',
        name: 'users-details',
        component: './Users/details',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/performance',
    name: 'performance',
    icon: 'crown',
    access: false,
    routes: [
      {
        path: '/performance',
        redirect: '/performance/list',
      },
      {
        path: '/performance/page',
        name: 'performance-page',
        component: './Performance/page',
      },
      {
        path: '/performance/api',
        name: 'performance-api',
        component: './Performance/api',
      },
      // {
      //   path: '/users/details',
      //   name: 'users-details',
      //   component: './Users/details',
      //   hideInMenu: true,
      // },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
