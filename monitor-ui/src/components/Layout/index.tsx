/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-06 15:20:45
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-08 17:40:47
 * @FilePath: \monitor-ui\src\components\Layout\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import React, {useState, lazy, Suspense} from "react";
// import {Outlet } from "react-router-dom"
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import type {MenuProps} from "antd";
// import LayoutHeader from "./components/Header";

import {Breadcrumb, Layout, Menu, theme,Button} from "antd";
// import BaseRouter from "../../router/index";
const BaseRouter = lazy(() => import("@/router/index"));

const {Header, Content, Sider} = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const App: React.FC = (props) => {
  console.log(props);
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
        />
      </Sider>
      <Layout>
        <Header style={{padding: 0, background: colorBgContainer,display:'flex'}}>
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
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
            style={{padding: 24, minHeight: 360, background: colorBgContainer}}>
            <Suspense fallback={<div>Loading</div>}>
              <BaseRouter />
            </Suspense>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};

export default App;
