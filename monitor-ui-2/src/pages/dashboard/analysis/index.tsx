/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-22 15:35:31
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-28 11:27:55
 * @FilePath: \monitor-ui-2\src\pages\dashboard\analysis\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import api from '@/services/monitor';
import { GridContent } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, DatePicker, DateType, Input, Row, Select } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type { RadioChangeEvent } from 'antd/es/radio';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Suspense, useEffect, useState } from 'react';
import type { TimeType } from './components/ChartsCard';
import ChartsCard from './components/ChartsCard';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';
import ProportionSales from './components/ProportionSales';
import TopSearch from './components/TopSearch';
import type { AnalysisData } from './data.d';
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
  const [metricsData, setMetricsData] = useState<API.MetricsVo>('');
  const [currentDay, setCurrentDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [appId, setAppId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [systemOptions, setSystemOptions] = useState<any[]>([]);
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('month'),
  );
  const getRangeString = (type: number) => {
    return rangePickerValue![type]?.format('YYYY-MM-DD');
  };
  // Request

  const fetchMetrics = async () => {
    setLoading(true);
    const res = await api.eventsController.getMetricsUsingGet({ currentDay, userId, appId });
    setLoading(false);
    return res;
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

  //useEffect
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

  useEffect(() => {
    appId && fetchMetrics().then((res) => setMetricsData(res.data as API.MetricsVo));
  }, [currentDay, userId, appId]);

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
  console.log('🚀 ~ ?Array.from ~ data?.errorsTypeMap:', metricsData?.errorsTypeMap);

  let errorsTypeList = [];

  if (metricsData?.errorsTypeMap && metricsData?.errorsTypeMap.toString() !== '{}') {
    Object.keys(metricsData?.errorsTypeMap).forEach((key) => {
      errorsTypeList.push({ type: key, value: metricsData?.errorsTypeMap![key] });
    });
  }

  const handleChangeSalesType = (e: RadioChangeEvent) => {
    setSalesType(e.target.value);
  };
  const onSearch = (value: string) => {
    setUserId(value);
  };

  const handleChange = (value: DateType | null) => {
    setCurrentDay(value ? value.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
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
            value={appId}
            onChange={(value) => setAppId(value)}
            options={systemOptions}
          />
          <DatePicker onChange={handleChange} style={{ marginBottom: '24px' }} />
          <IntroduceRow loading={loading} visitData={metricsData || {}} currentDay={currentDay} />
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
                popularList={metricsData?.popularList || []}
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
