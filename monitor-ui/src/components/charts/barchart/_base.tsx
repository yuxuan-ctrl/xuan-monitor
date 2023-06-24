/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-13 09:38:31
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-06-13 14:47:24
 * @FilePath: \monitor-ui\src\components\charts\barchart\_base.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// import {useEffect, useState} from "react";
// import * as echarts from "echarts";
import {useEcharts} from "@/hooks/useEcharts";
import "./index.less";
import {useEffect, useState} from "react";

const BarChart = () => {
  const [chartData, setChartData] = useState(0.5);
  const options = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };

  //TODO 给Echart赋值
  //   useEffect(() => {
  //     setTimeout(() => {
  //       setChartData(1);
  //     },1000);
  //   });

  const [echartsRef] = useEcharts(options, chartData);

  return (
    <>
      <div ref={echartsRef} className="actual-echarts"></div>
    </>
  );
};

export default BarChart;
