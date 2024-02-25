import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Card, Col, Row, Table, Tooltip } from 'antd';
import numeral from 'numeral';
import React from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import NumberInfo from './NumberInfo';
import Trend from './Trend';

const TopSearch = ({
  loading,
  popularList,
  handleGroup,
}: {
  loading: boolean;
  handleGroup: React.ReactNode;
  popularList: API.PageViewCount[];
}) => {
  const { styles } = useStyles();

  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (
        <span
          className={`${styles.rankingItemNumber} ${
            index < 3 ? styles.rankingItemNumberActive : ''
          }`}
        >
          {index + 1}
        </span>
      ),
    },
    {
      title: '页面URL',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
      render: (text: React.ReactNode) => <a href="/">{text}</a>,
    },
    {
      title: '页面访问数（PV）',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    // {
    //   title: '页面访问人数（UV）',
    //   dataIndex: 'count',
    //   key: 'count',
    //   sorter: (
    //     a: {
    //       count: number;
    //     },
    //     b: {
    //       count: number;
    //     },
    //   ) => a.count - b.count,
    // },
    {
      title: '用户平均停留时间',
      dataIndex: 'averageStayDuration',
      key: 'averageStayDuration',
      render: (text: number) => (
        <span
          style={{
            marginRight: 4,
          }}
        >
          {(text / 1000).toFixed(2)} s
        </span>
      ),
    },
  ];
  return (
    <Card
      loading={loading}
      bordered={false}
      title="热门页面访问"
      extra={handleGroup}
      style={{
        height: '100%',
      }}
    >
      <Table<any>
        rowKey={(record) => record.index}
        size="small"
        columns={columns}
        dataSource={popularList}
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 5,
        }}
      />
    </Card>
  );
};
export default TopSearch;
