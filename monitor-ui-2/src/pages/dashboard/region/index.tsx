/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-03-14 16:09:42
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-03-15 16:38:30
 * @FilePath: \monitor-ui-2\src\pages\dashboard\region\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { DatePicker, Row, Col } from 'antd';

import { Scene, Source, PolygonLayer, PointLayer, LineLayer, Popup, Marker } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

import './index.less';
import { GridContent, PageLoading } from '@ant-design/pro-components';
import dayjs from 'dayjs';

const Region: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const init = () => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [110, 30],
        minZoom:3,
        maxZoom:3,
        
        pitch: 0,
        style: 'light', //light或darl
      }),
    });

    const url =
      // 'https://mvt.amap.com/district/CHN2/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
      // 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
      '/api/static/china-province.geojson';
    
      const addMarkers = (provinceData) => {
      for (let i = 0; i < provinceData?.length; i++) {
        // if (provinceData?.[i].g !== '1' || provinceData[i].v === '') {
        //   continue;
        // }
        const el = document.createElement('label');
        el.className = 'labelclass';
        el.textContent = provinceData[i].name;
        el.style.background = '#AAAAAA';
        el.style.borderColor = '#AAAAAA';
        const marker = new Marker({
          element: el,
        }).setLnglat({
          lng: provinceData[i]?.center?.[0] * 1 || 0,
          lat: provinceData[i]?.center?.[1] || 0,
        });
        scene.addMarker(marker);
      }
    };


    fetch(url).then(async (res) => {
      const data = await res.json();
      const provinceData = data.features.map((item) => item.properties);
      const source = new Source(data);

      const fill = new PolygonLayer({
        sourceLayer: 'CHN_Cities',
      })
        .source(source)
        .shape('fill')
        .active(true);
      // .color('adcode_pro', getColorByDGP);

      fill.on('mousemove', (e) => {
        const popup = new Popup({
          offsets: [0, 0],
          closeButton: false,
        }).setLnglat(e.lngLat);
        // .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.density}</span>`);
        scene.addPopup(popup);
      });


      const line2 = new LineLayer({
        sourceLayer: 'CHN_L',
      })
        .source(source)
        .shape('line')
        .size(0.6)
        .color('#AAAAAA');


      scene.addLayer(fill);
      // scene.addLayer(line);
      scene.addLayer(line2);
      // scene.addLayer(text);
      addMarkers(provinceData);
      scene.render();
    });
  };

  const handleChange = (value) => {
    setCurrentDay(value ? value.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <DatePicker onChange={handleChange} style={{ marginBottom: '24px' }} />
        </Suspense>
        <Suspense fallback={<PageLoading />}>
          <Row
            gutter={24}
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <div id="map"></div>
              </Suspense>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>111</Suspense>
            </Col>
          </Row>
        </Suspense>
      </>
    </GridContent>
  );
};

export default Region;
