/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-26 16:15:36
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-26 17:31:14
 * @FilePath: \monitor-ui-2\src\pages\Errors\details\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useLocation, useRequest } from '@umijs/max';
import { Badge, Card, Descriptions, Divider, Empty } from 'antd';
import type { FC } from 'react';
import React from 'react';
import useStyles from './style.style';
import api from '@/services/monitor';
import dayjs from 'dayjs';
import Record from '@/utils/record';
import './styles.less';

const Basic: FC = () => {
  const { state } = useLocation();
  const { styles } = useStyles();
  const recordPlayer = new Record();
  console.log(state);

  const { loading, data } = useRequest(
    () => api.errorsController.getDetailsUsingGet({ id: state.id }),
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [state.id],
    },
  );
  console.log('🚀 ~ data:', data);

  if (data?.record?.length > 2) {
    recordPlayer.replay(document.getElementById('player'), data?.record);
  }
  return (
    <PageContainer content="">
      <Card bordered={false}>
        <Descriptions
          title="基本信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="用户ID">{data?.userId}</Descriptions.Item>
          <Descriptions.Item label="ip地址">{data?.ipAddress}</Descriptions.Item>
          <Descriptions.Item label="用户平台">{data?.platform}</Descriptions.Item>
          <Descriptions.Item label="系统信息">{data?.userAgent}</Descriptions.Item>
          <Descriptions.Item label="所在地区">{data?.belongCity}</Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <Descriptions
          title="错误信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="错误描述">{data?.errorMessage}</Descriptions.Item>
          <Descriptions.Item label="错误类型">{data?.errorType}</Descriptions.Item>
          <Descriptions.Item label="发生时间">
            {dayjs(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="错误堆栈">{data?.stackTrace}</Descriptions.Item>
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
        {(data?.record?.length < 2 || !data?.record) && (
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
