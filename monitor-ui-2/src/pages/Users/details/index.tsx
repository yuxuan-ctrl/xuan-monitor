/* eslint-disable no-case-declarations */
/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-26 16:15:36
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-03-19 17:29:32
 * @FilePath: \monitor-ui-2\src\pages\Users\details\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProList, ProTable } from '@ant-design/pro-components';
import { useLocation, useRequest } from '@umijs/max';
import {
  Badge,
  Card,
  Descriptions,
  Divider,
  Empty,
  Space,
  Tag,
  Row,
  Col,
  DatePicker,
  DateType,
} from 'antd';
import type { FC } from 'react';
import React, { useState, Suspense } from 'react';
import api from '@/services/monitor';
import dayjs from 'dayjs';
import AvatarImg from '../../../../public/icons/avatar.png'; // 引入图片

import './styles.less';

const Basic: FC = () => {
  const { state } = useLocation();
  const [currentDay, setCurrentDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const { RangePicker } = DatePicker;
  const [startTime, setStartTime] = useState(
    dayjs(new Date().getTime() - 36000000).format('YYYY-MM-DD HH:mm:ss'),
  );
  const [endTime, setEndTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { loading, data } = useRequest(
    () =>
      api.userController.getUserDetailsUsingGet({
        userId: state.userId,
        startTime,
        endTime,
        ...pagination,
      }),
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [state.userId, pagination.pageIndex, startTime, endTime],
    },
  );

  const getSubTitle = (row) => {
    console.log('🚀 ~ getSubTitle ~ row:', row);
    let description;
    switch (row.type) {
      case 'Event':
        description = <span>跳转到了{row.description}</span>;
        break;
      case 'HttpRequest':
        const requestData = JSON.parse(row.description);
        description = <span>请求了{requestData.requestUrl}</span>;
        break;
      case 'click':
        const clickData = JSON.parse(row.description);
        description = <span>点击了{clickData.text}</span>;
        break;
    }
    return description;
  };
  const paginationChange = (val) => {
    setPagination((prev) => {
      return { ...prev, pageIndex: val };
    });
  };

  const handleChange = (value: DateType | null) => {
    setStartTime(
      Array.isArray(value) && value.length > 0
        ? value[0].format('YYYY-MM-DD HH:mm:ss')
        : dayjs(new Date().getTime() - 36000000).format('YYYY-MM-DD HH:mm:ss'),
    );
    setEndTime(
      value[0] ? value[0].format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
    );
  };
  console.log('🚀 ~ data:', data);

  return (
    <PageContainer content="">
      <Card bordered={false}>
        <Descriptions
          title="基本信息"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="用户ID">{data?.user?.userId}</Descriptions.Item>
          <Descriptions.Item label="ip地址">{data?.user?.ipAddress}</Descriptions.Item>
          <Descriptions.Item label="用户平台">{data?.user?.platform}</Descriptions.Item>
          <Descriptions.Item label="系统信息">{data?.user?.userAgent}</Descriptions.Item>
          <Descriptions.Item label="所在地区">{data?.user?.belongCity}</Descriptions.Item>
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
        <Descriptions title="用户行为记录"></Descriptions>
        <Suspense>
          <RangePicker showTime onChange={handleChange} style={{ marginBottom: '24px' }} />
        </Suspense>
        <ProList<API.UserAction>
          request={(val) => {
            console.log('🚀 ~ val:', val);
          }}
          rowKey="name"
          dataSource={data?.userActionLogs?.records || []}
          pagination={{
            total: data?.userActionLogs?.total,
            pageSize: 10,
            onChange: paginationChange,
          }}
          showActions="hover"
          metas={{
            title: {
              dataIndex: 'userId',
              title: '用户',
            },
            avatar: {
              dataIndex: 'avatar',
              search: false,
              render: (text) => {
                return <img src={AvatarImg} style={{ width: '20px', height: '20px' }}></img>;
              },
            },
            description: {
              dataIndex: 'description',
              search: false,
              render: (_, row) => {
                const text =
                  row.type === 'HttpRequest'
                    ? JSON.parse(row.description).requestUrl
                    : row.description;
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p>描述：{getSubTitle(row)}</p>
                      <p>发生页面：{row.pageUrl}</p>
                    </div>
                    <span>创建时间：{row.createTime}</span>
                  </div>
                );
              },
            },
            subTitle: {
              dataIndex: 'errorType',
              render: (_, row) => {
                console.log(row);
                return (
                  <Space size={0}>
                    <Tag color="blue" key={row.type}>
                      {row.type}
                    </Tag>
                    <Tag color="blue" key={row.id}>
                      {row.id}
                    </Tag>
                  </Space>
                );
              },
              search: false,
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};
export default Basic;
