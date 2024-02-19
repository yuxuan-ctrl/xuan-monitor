/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-09 09:18:11
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 09:58:09
 * @FilePath: \monitor-ui\src\pages\analysis\dataAnalysis\index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// import {useState} from "react";
import {Typography} from "antd";
import "./index.less";
import BarChart from "@/components/charts/barchart/_base";
import AnalysisList from "./list";
const {Title} = Typography;
const dataAnalysis = () => {
  return (
    <>
      <div className="an-container">
        <section>
          <Title level={3} className="an-container-label">
            数据分析
          </Title>
        </section>
        <div className="an-container-body">
          <AnalysisList />
          {/* <div className="info">
            <div className="box">
              <Title level={3}>PV：</Title>
              <Title level={3}>3.3k</Title>
            </div>
            <div className="box">
              <Title level={3}>UV：</Title>
              <Title level={3}>3.3k</Title>
            </div>
          </div>
          <BarChart /> */}
        </div>
      </div>
    </>
  );
};

export default dataAnalysis;
