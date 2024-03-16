import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Select, Row, Col, Card } from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';

import api from '@/services/monitor';
import { Scene, Source, PolygonLayer, PointLayer, LineLayer, Popup, Marker } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import dayjs from 'dayjs';
import { useRequest, useIntl, FormattedMessage } from '@umijs/max';
import './index.less';
import { GridContent, PageLoading } from '@ant-design/pro-components';

const Region: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [appId, setAppId] = useState<string>('');
  const [systemOptions, setSystemOptions] = useState<any[]>([]);
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.RegionUserVO>[] = [
    {
      title: '排名',
      dataIndex: 'index',
      render: (text, record, index, action) => {
        return index + 1;
      },
    },
    {
      title: <FormattedMessage id="pages.region.regionName" defaultMessage="Region Name" />,
      dataIndex: 'regionName',
    },
    {
      title: <FormattedMessage id="pages.region.userCount" defaultMessage="User Count" />,
      dataIndex: 'userCount',
      sorter: (a, b) => {
        console.log(a, b);

        return a.userCount - b.userCount;
      },
    },
  ];
  // 使用useRequest获取用户地区数据
  const { data: regionUserData } = useRequest(
    () => api.userController.getUsersByRegionUsingGet({ appId: '1' }),
    { refreshDeps: [appId] },
  );

  const { data: systemList } = useRequest(
    () => api.systemsController.getSystemsListUsingGet(), // 将 currentDay 转为数字类型（如果API需要数字）
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [], // 当 currentDay 改变时自动重新发起请求
    },
  );

  const handleChange = (value) => {
    setCurrentDay(value ? value.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
  };

  // 使用useMemo缓存处理后的provinceData
  const provinceDataMemoized = useMemo(() => {
    if (!regionUserData) return [];

    const processData = (rawData: any) => {
      return rawData.features
        .filter((city) =>
          regionUserData.find((region) => region.regionName === city.properties.name),
        )
        .map((item) => ({
          ...item.properties,
          userCount: regionUserData.find((region) => region.regionName === item.properties.name)
            ?.userCount,
        }));
    };

    return processData;
  }, [regionUserData]);

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
    if (!regionUserData) return;

    const initMap = async () => {
      const scene = new Scene({
        id: 'map',
        map: new Map({
          center: [110, 30],
          minZoom: 3,
          maxZoom: 3,
          pitch: 0,
          style: 'light',
        }),
      });

      const url = '/api/static/china-province.geojson';

      const response = await fetch(url);
      const data = await response.json();

      const processedProvinceData = provinceDataMemoized(data);

      const addMarkers = (provinceList) => {
        provinceList.forEach((province) => {
          const el = document.createElement('label');
          el.className = 'labelclass';
          el.textContent = province.userCount;
          // el.style.background = '#AAAAAA';
          // el.style.borderColor = '#AAAAAA';

          const marker = new Marker({
            element: el,
          }).setLnglat({
            lng: province.center?.[0] * 1 || 0,
            lat: province.center?.[1] || 0,
          });

          scene.addMarker(marker);
        });
      };

      const source = new Source(data);

      const fill = new PolygonLayer({
        sourceLayer: 'CHN_Cities',
      })
        .source(source)
        .shape('fill')
        .active(true)
        .color('#F2F2F2');
      // .color('adcode_pro', getColorByDGP); // 不清楚getColorByDGP的具体实现，保留原代码

      fill.on('mousemove', (e) => {
        const currentProvince = processedProvinceData.find((item) => {
          return item.adcode === e.feature.properties.adcode;
        });
        const popup = new Popup({
          offsets: [0, 0],
          closeButton: false,
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>${e.feature.properties.name}: ${currentProvince?.userCount || 0}</span>`); // 根据实际情况填充popup内容
        scene.addPopup(popup);
      });

      const line2 = new LineLayer({
        sourceLayer: 'CHN_L',
      })
        .source(source)
        .shape('line')
        .size(0.6)
        .color('#FFFFFF');

      scene.addLayer(fill);
      // scene.addLayer(line); // 如果有line层，则添加
      scene.addLayer(line2);
      // scene.addLayer(text); // 如果有text层，则添加

      addMarkers(processedProvinceData);
      scene.render();
    };

    // 只在regionUserData改变时初始化地图
    initMap();
  }, [provinceDataMemoized, regionUserData]);

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
        </Suspense>
        <Suspense fallback={<PageLoading />}>
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Card
                  bodyStyle={{
                    padding: '20px 24px 8px 24px',
                  }}
                >
                  <div id="map"></div>
                </Card>
              </Suspense>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              {/* 在这里填充右边栏内容 */}
              <Suspense fallback={null}>
                <Card
                  bodyStyle={{
                    padding: '20px 24px 8px 24px',
                  }}
                  style={{ height: '828px' }}
                >
                  <ProTable<API.RegionUserVO, API.getUsersByRegionUsingGETParams>
                    actionRef={actionRef}
                    rowKey="userId"
                    search={false}
                    dataSource={regionUserData?.sort((a, b) => b.userCount - a.userCount)}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 628 }}
                  />
                </Card>
              </Suspense>
            </Col>
          </Row>
        </Suspense>
      </>
    </GridContent>
  );
};

export default Region;
