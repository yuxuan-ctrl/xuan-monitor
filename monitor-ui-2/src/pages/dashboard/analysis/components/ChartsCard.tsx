import { Column, Line } from '@ant-design/plots';
import { Card, Col, DatePicker, Row, Tabs, Empty } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type dayjs from 'dayjs';
import useStyles from '../style.style';

export type TimeType = 'today' | 'week' | 'month' | 'year';
const { RangePicker } = DatePicker;

const ChartsCard = ({
  rangePickerValue,
  chartsData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerProps<dayjs.Dayjs>['value'];
  isActive: (key: TimeType) => string;
  chartsData: API.MetricsVo[];
  loading: boolean;
  handleRangePickerChange: RangePickerProps<dayjs.Dayjs>['onChange'];
  selectDate: (key: TimeType) => void;
}) => {
  const baseConfig = {
    data: chartsData.map((item) => {
      return {
        createTime: item.createTime?.split(' ')[0],
        totalPageViews: item.totalPageViews,
        uniqueVisitors: item.uniqueVisitors,
      };
    }),
    xField: 'createTime',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };
  const { styles } = useStyles();
  return (
    <Card
      loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.ChartsCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  今日
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  本周
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  本月
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  本年
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{
                  width: 256,
                }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
          items={[
            {
              key: 'sales',
              label: '流量（PV）',
              children: (
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {Array.isArray(chartsData) && chartsData.length > 0 ? (
                        <Line {...baseConfig} yField="totalPageViews" />
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          imageStyle={{ height: 60 }}
                          description={<span>暂无PV数据</span>}
                        ></Empty>
                      )}
                    </div>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'views',
              label: '独立访客数（UV）',
              children: (
                <Row>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {Array.isArray(chartsData) && chartsData.length > 0 ? (
                        <Line {...baseConfig} yField="uniqueVisitors" />
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          imageStyle={{ height: 60 }}
                          description={<span>暂无UV数据</span>}
                        ></Empty>
                      )}
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};
export default ChartsCard;
