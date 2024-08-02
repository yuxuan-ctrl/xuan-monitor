/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-26 16:15:36
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-08-02 15:38:35
 * @FilePath: \xuan-monitor\monitor-ui-2\src\pages\Performance\api\details\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { PageContainer } from '@ant-design/pro-components';
import { useLocation, useRequest } from '@umijs/max';
import { Card, Descriptions, Divider, Empty } from 'antd';
import type { FC } from 'react';
import React from 'react';
// import useStyles from './style.style';
import api from '@/services/monitor';
import dayjs from 'dayjs';
import Record from '@/utils/record';

const Basic: FC = () => {
  const { state } = useLocation();
  const recordPlayer = new Record();
  console.log(state);

  const { loading, data } = useRequest(
    () => api.performanceController.getInterfaceInfoByIdUsingGet({ id: state.id }),
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [state.id],
    },
  );
  console.log('🚀 ~ data:', data);

  const record = data?.record ?JSON.parse(data?.record) : [];

  if (record?.length > 2) {
    recordPlayer.replay(document.getElementById('player'), record);
  }
  return (
    <PageContainer content="">
      <Card bordered={false}>
        <Descriptions
          title="基本信息"
          style={{
            marginBottom: 32,
            marginRight:32
          }}
        >
          <Descriptions.Item label="用户ID">{data?.userId}</Descriptions.Item>
          <Descriptions.Item label="系统ID">{data?.appId}</Descriptions.Item>
          <Descriptions.Item label="发生页面">{data?.pageUrl}</Descriptions.Item>
          <Descriptions.Item label="发生时间">
            {dayjs(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <Descriptions
          title="接口信息"
          style={{
            marginBottom: 32,
            marginRight:32
          }}
        >
          <Descriptions.Item label="请求路径">{data?.requestUrl}</Descriptions.Item>
          <Descriptions.Item label="请求方法">{data?.method}</Descriptions.Item>

          <Descriptions.Item label="响应时间">{data?.duration}</Descriptions.Item>
          <Descriptions.Item label="请求体" span={3}>{data?.body}</Descriptions.Item>
          <Descriptions.Item label="请求头" span={3}>{data?.headers}</Descriptions.Item>
          <Descriptions.Item label="响应结果" span={3}>{data?.response}</Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
      </Card>
      <Card
        style={{
          marginTop: 24,
        }}
      >
        <Descriptions title="录像回放"></Descriptions>
        <div id="player"></div>
        {(record?.length < 2 || !record) && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 60 }}
            description={<span>暂无录像数据</span>}
          ></Empty>
        )}
      </Card>
    </PageContainer>
  );
};
export default Basic;
