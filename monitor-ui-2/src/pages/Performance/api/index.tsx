/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-03-19 18:17:17
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-03-22 15:18:50
 * @FilePath: \monitor-ui-2\src\pages\Performance\api\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import React from 'react';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Radio } from 'antd';
import { useRequest, history, FormattedMessage, useIntl } from '@umijs/max';
import { useState, type FC } from 'react';
import api from '@/services/monitor';
import AvatarImg from '../../../../public/icons/avatar.png'; // 引入图片
import './index.less';

const Performance = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [requestUrl, setRequestUrl] = useState('');
  const [method, setMethod] = useState('');
  const [timeStep, setTimeStep] = useState('1');
  const [appId, setAppId] = useState('');
  const intl = useIntl();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="pages.performance.api.requestUrl" defaultMessage="requestUrl" />,
      dataIndex: 'requestUrl',
      tip: '请求路径',
    },
    {
      title: <FormattedMessage id="pages.performance.api.method" defaultMessage="method" />,
      dataIndex: 'method',
    },
    {
      title: <FormattedMessage id="pages.performance.api.duration" defaultMessage="duration" />,
      dataIndex: 'duration',
      search: false,
    },
  ];

  // Request
  const { loading, data } = useRequest(
    () =>
      api.performanceController.getInterfacePageUsingGet({
        appId,
        ...pagination,
        requestUrl,
        method,
        timeStep,
      }),
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [pagination.pageIndex, appId, requestUrl, method, timeStep],
    },
  );

  const paginationChange = (val) => {
    setPagination((prev) => {
      return { ...prev, pageIndex: val };
    });
  };

  const handleRadioChange = (event) => {
    setTimeStep(event.target.value);
  };

  const gotoFun = (type, row) => {
    console.log('🚀 ~ gotoFun ~ row:', row);
    switch (type) {
      case 'details':
        history.push('/errors/details', { id: row.esErrorId });
        break;
    }
  };
  return (
    <PageContainer>
      <div className="timeStep">
        <span>接口耗时分段：</span>
        <Radio.Group defaultValue="1" buttonStyle="solid" onChange={handleRadioChange}>
          <Radio.Button value="1">低于1秒</Radio.Button>
          <Radio.Button value="2">1-5秒</Radio.Button>
          <Radio.Button value="3">5-10秒</Radio.Button>
          <Radio.Button value="4">10秒以上</Radio.Button>
        </Radio.Group>
      </div>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        beforeSearchSubmit={async (params) => {
          setRequestUrl(params.requestUrl);
          setMethod(params.method);
        }}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        pagination={{ ...pagination, total: data?.total, onChange: paginationChange }}
        dataSource={data?.records}
        columns={columns}
      />
    </PageContainer>
  );
};
export default Performance;
