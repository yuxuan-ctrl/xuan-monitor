/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-27 09:03:57
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-27 10:01:30
 * @FilePath: \monitor-ui-2\src\utils\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import { Empty } from 'antd'; // 假设你正在使用Ant Design的Empty组件

// 定义一个通用的工具函数
export const getConditionalComponent = <
  C extends React.ComponentType<any>,
  P = C extends React.ComponentType<infer TP> ? TP : never,
>(
  condition: boolean,
  Component: C,
  props?: P,
  EmptyComponent?: C,
): React.ReactElement | JSX.Element => {
  if (condition) {
    return <Component {...(props as P)} />; // 类型断言以确保props正确传递
  } else {
    return EmptyComponent ? (
      EmptyComponent
    ) : (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateY(36px)',
        }}
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ height: 60 }} />
      </div>
    );
  }
};
