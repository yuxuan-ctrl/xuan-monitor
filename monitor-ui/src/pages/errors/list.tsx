import {Table, Pagination, Space, Input, Button} from "antd";
import {useEffect, useState} from "react";
import useSWR, {mutate} from "swr";
import "./list.less";
import {useNavigate} from "react-router-dom";

const AnalysisList = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 自定义列渲染
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
      dataIndex: "timestamp",
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
      title: "操作",
      render: customRender,
    },
  ];

  const getKey = () =>
    `${API.errors.getPageData.path}?pageIndex=${pagination.current}&pageSize=${pagination.pageSize}`;

  const fetcher = (url) =>
    API.errors.getPageData
      .request({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((res) => res.data);

  const {data: rawData, error} = useSWR(getKey(), fetcher);
  const dataSource = (rawData || {}).records || [];

  // 数据获取函数

  // 分页改变时重新获取数据
  useEffect(() => {
    mutate(getKey());
  }, [pagination.current]);

  const gotoDetails = (row) => {
    navigate(`/errors/details/${row.esErrorId}`);
  };

  const onTableChange = (newPageIndex, newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPageIndex,
      pageSize: newPagination.pageSize || prev.pageSize,
    }));
  };

  return (
    <>
      {/* 表格组件内容不变 */}
      <div className="analysisList-container">
        <Table
          rowKey="timestamp"
          dataSource={dataSource}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            total: rawData?.total || 0,
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (_, newPagination) => onTableChange(_, newPagination),
            // onShowSizeChange: 可以根据需要添加大小变化时的处理逻辑
          }}
        />
      </div>
    </>
  );
};

export default AnalysisList;
