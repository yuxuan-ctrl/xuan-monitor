/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-08-02 15:43:58
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-08-02 15:45:27
 * @FilePath: \xuan-monitor\monitor-ui-2\src\components\SystemSelect\select.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import api from '@/services/monitor';
import { useRequest } from '@umijs/max';
import { Select } from 'antd';
import { useEffect, useState } from 'react';

const SystemSelect = ({ appId, setAppId }) => {
  const [systemOptions, setSystemOptions] = useState<any[]>([]);
  const { data: systemList } = useRequest(
    () => api.systemsController.getSystemsListUsingGet(), // 将 currentDay 转为数字类型（如果API需要数字）
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [], // 当 currentDay 改变时自动重新发起请求
    },
  );

  useEffect(() => {
    setSystemOptions(
      Array.isArray(systemList)
        ? systemList.map((item) => {
            return { label: item.appName, value: item.appId };
          })
        : [],
    );
    if (systemList && systemList.length > 0 && systemList[0]) {
      setAppId(systemList[0].appId as string);
    }
  }, [systemList]);
  return (
    <Select
      style={{ width: '200px', marginRight: '24px' }}
      placeholder="请选择当前系统"
      value={appId}
      onChange={(value) => setAppId(value)}
      options={systemOptions}
    />
  );
};

export default SystemSelect;
