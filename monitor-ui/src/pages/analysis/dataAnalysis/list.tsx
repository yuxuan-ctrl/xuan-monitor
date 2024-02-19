/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-19 09:51:12
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 18:21:06
 * @FilePath: \monitor-ui\src\pages\analysis\dataAnalysis\list.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

import {Table, Pagination, Space, Input, Button} from "antd";
import {useEffect, useState} from "react";
import useSWR from "swr";
import Record from "@/utils";

const gotoDetails = (row)=>{
  
  new Record().replay(document.getElementById("replay"),row.record);
}

const customRender = (row) => (  
  <Button type="primary" onClick={() => gotoDetails(row)}>
    自定义操作
  </Button>
);

// 定义列的配置
const columns = [
  {
    title: "错误编号",
    dataIndex: "esErrorId",
    // render: (text, record, index) => `${index + 1}`,
  },
  {
    title: "错误类型",
    dataIndex: "errorType",
  },
  {
    title: "发生时间",
    dataIndex: "createTime",
  },
  {
    title: "发生页面",
    dataIndex: "url",
  },
  {
    title: "系统编号",
    dataIndex: "appId",
  },
  {
    title: "用户编号",
    dataIndex: "userId",
  },
  {
    title:"操作",
    render: customRender,
  }
];

const AnalysisList = () => {
  const [dataSourceState, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 使用useSWR获取数据并设置初始状态
  const { data: dataSource, error } = useSWR(
    API.errors.getPageData.path,
    (url) =>
      API.errors.getPageData.request({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      }).then((res) => res.data),
    { refreshInterval: 0 } // 去除自动刷新，仅在分页或排序变化时重新请求
  );

  useEffect(() => {
    if (dataSource && !error) {
      setDataSource(dataSource.records || []);
      setPagination((prev) => ({ ...prev, total: dataSource.total }));
    }
  }, [dataSource, error]);

  const onTableChange = (newPagination) => {
    setPagination(newPagination);
    // 重新触发useSWR以获取新的分页数据
    // 注意：如果API支持直接通过URL参数传递分页信息，则无需手动调用mutate
    // 如果需要根据新分页参数重新发起请求，请使用mutate函数
    // mutate(API.errors.getPageData.path, {pageIndex: newPagination.current, pageSize: newPagination.pageSize});
  };

  

  // 处理单元格内容更改的函数（已注释掉，因为未在当前代码中使用）

  return (
    <>
      <div className="analysisList-container">
        <Table
          rowKey="key"
          dataSource={dataSourceState.slice(
            (pagination.current - 1) * pagination.pageSize,
            pagination.current * pagination.pageSize
          )}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            total: pagination.total,
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (_, newPagination) => onTableChange(newPagination),
            // onShowSizeChange: (_, newPageSize, newCurrent) =>
            //   onTableChange({ current: newCurrent, pageSize: newPageSize }),
          }}
        />
        {/* 分页器 */}
        <Pagination
          showQuickJumper
          showTotal={(total) => `总计 ${total} 条`}
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(_, newPagination) => onTableChange(newPagination)}
          // onShowSizeChange={(_, newPageSize, newCurrent) =>
          //   onTableChange({ current: newCurrent, pageSize: newPageSize })
          // }
        />
        <div id="player"></div>
      </div>
    </>
  );
};

export default AnalysisList;