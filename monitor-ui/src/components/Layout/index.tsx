/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-06 15:20:45
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-12 14:41:27
 * @FilePath: \monitor-ui\src\components\Layout\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React, {useState, lazy, Suspense} from "react";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import type {MenuProps} from "antd";
import {Breadcrumb, Layout, Menu, theme, Button} from "antd";
import {rootRouter} from "@/router/index";
import {RouteObject} from "@/router/interface";
import {useNavigate} from "react-router-dom";

const BaseRouter = lazy(() => import("@/router/index"));
const {Header, Content, Sider} = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const App = (props) => {
  const navigate = useNavigate();

  /**
   *
   *@description 将路由列表转化成Menu列表所需的格式
   * @param {RouteObject[]} item
   * @return {*}
   */
  const getItem = (item: RouteObject[]) => {
    const items: MenuItem[] = convert(item);
    return items;
  };

  /**
   *
   *  @description 递归转换格式
   * @param {RouteObject[]} item
   * @return {*}  {MenuItem[]}
   */
  const convert = (item: RouteObject[]): MenuItem[] => {
    const result: MenuItem[] = [];
    item.forEach((route) => {
      const menu: any = {
        key: route.path as string,
        icon: "",
        label: route.meta?.title as string,
      };
      if (route.children && route.children!.length)
        menu.children = convert(route.children as RouteObject[]);
      route.meta && route.meta.title && result.push(menu);
    });
    return result;
  };

  const items = getItem(rootRouter);

  /**
   *
   *@description 菜单点击跳转
   * @param {MenuItem} item
   */
  const menubarClick = (item: MenuItem) => {
    navigate(item.key as string);
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer},
  } = theme.useToken();

  return (
    <Layout style={{minHeight: "100vh"}}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={menubarClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{padding: 0, background: colorBgContainer, display: "flex"}}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        {/* <LayoutHeader /> */}
        <Content style={{margin: "0 16px"}}>
          <Breadcrumb style={{margin: "16px 0"}}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              // padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}>
            <Suspense fallback={<div>Loading</div>}>
              <BaseRouter />
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
