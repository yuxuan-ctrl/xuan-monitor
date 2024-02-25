/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-22 15:35:31
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-23 18:11:23
 * @FilePath: \monitor-ui-2\src\pages\dashboard\analysis\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { EllipsisOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, DatePicker, Input, Row, Select, DateType } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type { RadioChangeEvent } from 'antd/es/radio';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Suspense, useEffect, useState } from 'react';
import IntroduceRow from './components/IntroduceRow';
import OfflineData from './components/OfflineData';
import PageLoading from './components/PageLoading';
import ProportionSales from './components/ProportionSales';
import type { TimeType } from './components/ChartsCard';
import ChartsCard from './components/ChartsCard';
import TopSearch from './components/TopSearch';
import type { AnalysisData } from './data.d';
import api from '@/services/monitor';
import useStyles from './style.style';
import { getTimeDistance } from './utils/utils';
type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';

const Analysis: FC<AnalysisProps> = () => {
  const { Search } = Input;
  const { styles } = useStyles();
  const [salesType, setSalesType] = useState<SalesType>('all');
  const [userId, setUserId] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [currentTabKey, setCurrentTabKey] = useState<string>('');
  const [appId, setAppId] = useState<string>('');
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('week'),
  );

  //useEffect
  useEffect(() => {}, []);

  // Request
  const { loading, data } = useRequest(
    () => api.eventsController.getMetricsUsingGet({ currentDay, userId, appId }), // 将 currentDay 转为数字类型（如果API需要数字）
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [currentDay, userId, appId], // 当 currentDay 改变时自动重新发起请求
    },
  );

  const getRangeString = (type: number) => {
    return rangePickerValue![type]?.format('YYYY-MM-DD');
  };

  const { data: chartsData } = useRequest(
    () =>
      api.eventsController.getChartsDataUsingGet({
        startTime: getRangeString(0),
        endTime: getRangeString(1),
      }), // 将 currentDay 转为数字类型（如果API需要数字）
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [rangePickerValue], // 当 currentDay 改变时自动重新发起请求
    },
  );

  const { data: systemList } = useRequest(
    () => api.systemsController.getSystemsListUsingGet(), // 将 currentDay 转为数字类型（如果API需要数字）
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [], // 当 currentDay 改变时自动重新发起请求
    },
  );
  console.log('🚀 ~ systemList:', systemList);

  //methods

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as dayjs.Dayjs, 'day') &&
      rangePickerValue[1].isSame(value[1] as dayjs.Dayjs, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };
  console.log('🚀 ~ ?Array.from ~ data?.errorsTypeMap:', data?.errorsTypeMap);

  let errorsTypeList = [];
  console.log(data?.errorsTypeMap);

  if (data?.errorsTypeMap && data?.errorsTypeMap.toString() !== '{}') {
    Object.keys(data?.errorsTypeMap).forEach((key) => {
      errorsTypeList.push({ type: key, value: data?.errorsTypeMap![key] });
    });
  }

  const handleChangeSalesType = (e: RadioChangeEvent) => {
    setSalesType(e.target.value);
  };
  const onSearch = (value: string) => {
    setUserId(value);
  };

  const handleChange = (value: DateType | null, dateString: string) => {
    setCurrentDay(value.format('YYYY-MM-DD'));
  };

  const handleSystemChange = (value, dateString: string) => {
    setAppId(dateString);
  };

  // todo
  const handleGroup = (
    <Search placeholder="请输入userId" onSearch={onSearch} style={{ width: 200 }} />
  );

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <Select
            style={{ width: '200px', marginRight: '24px' }}
            placeholder="请选择当前系统"
            onChange={handleSystemChange}
            options={
              Array.isArray(systemList)
                ? systemList.map((item) => {
                    return { label: item.appName, value: item.appId };
                  })
                : []
            }
          />
          <DatePicker onChange={handleChange} style={{ marginBottom: '24px' }} />
          <IntroduceRow loading={loading} visitData={data || {}} currentDay={currentDay} />
        </Suspense>

        <Suspense fallback={null}>
          <ChartsCard
            rangePickerValue={rangePickerValue}
            chartsData={chartsData || []}
            isActive={isActive}
            handleRangePickerChange={handleRangePickerChange}
            loading={loading}
            selectDate={selectDate}
          />
        </Suspense>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearch
                loading={loading}
                popularList={data?.popularList || []}
                handleGroup={handleGroup}
              />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                handleGroup={handleGroup}
                salesType={salesType}
                loading={loading}
                errorsTypeList={errorsTypeList}
                handleChangeSalesType={handleChangeSalesType}
              />
            </Suspense>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};
export default Analysis;
