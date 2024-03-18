/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-26 16:15:36
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-03-18 18:08:58
 * @FilePath: \monitor-ui-2\src\pages\Users\details\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProList, ProTable } from '@ant-design/pro-components';
import { useLocation, useRequest } from '@umijs/max';
import { Badge, Card, Descriptions, Divider, Empty, Space, Tag, Row, Col } from 'antd';
import type { FC } from 'react';
import React, { useState } from 'react';
import api from '@/services/monitor';
import dayjs from 'dayjs';
import AvatarImg from '../../../../public/icons/avatar.png'; // 引入图片

import './styles.less';

const Basic: FC = () => {
  const { state } = useLocation();

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const { loading, data } = useRequest(
    () =>
      api.userController.getUserDetailsUsingGet({
        userId: state.userId,
        startTime: dayjs(new Date().getTime() - 36000000).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        ...pagination,
      }),
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [state.userId, pagination.pageIndex],
    },
  );

  const paginationChange = (val) => {
    setPagination((prev) => {
      return { ...prev, pageIndex: val };
    });
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
        {/* <Descriptions
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
        </Descriptions> */}
        {/* <Divider
          style={{
            marginBottom: 32,
          }}
        /> */}
      </Card>
      <Card
        style={{
          marginTop: 24,
        }}
      >
        <Descriptions title="用户行为记录"></Descriptions>
        {/* <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}> */}
        <ProList<API.UserAction>
          // search={{}}
          // rowSelection={{
          //   type: "radio",
          // ...rowSelection,
          // }}
          request={(val) => {
            console.log('🚀 ~ val:', val);
            // setUserId(val?.userId)
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
                      <p>描述：{text}</p>
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
                return (
                  <Space size={0}>
                    <Tag color="blue" key={row.id}>
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
        {/* </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            111
          </Col>
        </Row> */}
      </Card>
    </PageContainer>
  );
};
export default Basic;
