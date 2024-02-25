import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Progress, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import Yuan from '../utils/Yuan';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({
  loading,
  visitData,
  hoursBack,
}: {
  loading: boolean;
  visitData: API.MetricsVo;
  hoursBack: string;
}) => {
  const { styles } = useStyles();

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="独立访客数（UV）"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={visitData.uniqueVisitors}
          footer={<Field label="总用户数" value={visitData.allUsersLength} />}
          contentHeight={46}
        >
          {visitData.uniqueVisitors! > visitData.pastByMetric?.uniqueVisitors ? (
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              较前一天新增用户
              <span className={styles.trendText}>
                {visitData.uniqueVisitors - visitData.pastByMetric?.uniqueVisitors}
              </span>
            </Trend>
          ) : (
            <Trend
              flag="down"
              style={{
                marginRight: 16,
              }}
            >
              较前一天减少用户
              <span className={styles.trendText}>
                {visitData.pastByMetric?.uniqueVisitors - visitData.uniqueVisitors}
              </span>
            </Trend>
          )}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="总访问流量（PV）"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={visitData.totalPageViews}
          footer={<Field label="今日访问流量" value={visitData.averageStayDuration?.toFixed(2)} />}
          contentHeight={46}
        >
          {visitData.totalPageViews! > visitData.pastByMetric?.totalPageViews ? (
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              较前一天新增流量
              <span className={styles.trendText}>
                {visitData.totalPageViews - visitData.pastByMetric?.totalPageViews}
              </span>
            </Trend>
          ) : (
            <Trend
              flag="down"
              style={{
                marginRight: 16,
              }}
            >
              较前一天减少流量
              <span className={styles.trendText}>
                {visitData.pastByMetric?.totalPageViews - visitData.totalPageViews}
              </span>
            </Trend>
          )}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="总错误数"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={visitData.totalErrorCount}
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {/* <Trend
                flag="up"
                style={{
                  marginRight: 16,
                }}
              >
                周同比
                <span className={styles.trendText}>12%</span>
              </Trend> */}
              今日错误数
              <span className={styles.trendText}>{visitData.dailyErrorCount}</span>
            </div>
          }
          contentHeight={46}
        >
          <div style={{ display: 'flex' }}>
            <span style={{ width: '100px' }}>解决率:</span>
            <Progress
              percent={
                (visitData.resolvedErrorCount! / visitData.totalErrorCount!).toFixed(2) * 100
              }
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              status="active"
            ></Progress>
          </div>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="访问量最多的页面"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <Field label="" value={visitData.mostVisitedPageId}></Field>}
          footer={<Field label="最高访问次数" value={`${visitData.mostVisitedPageViews}`} />}
          contentHeight={46}
        >
          {/* <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            周同比
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            日同比
            <span className={styles.trendText}>11%</span>
          </Trend> */}
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
