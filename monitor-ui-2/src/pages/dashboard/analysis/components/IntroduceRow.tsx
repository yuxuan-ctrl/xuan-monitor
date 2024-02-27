import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Progress, Row, Tooltip, Empty } from 'antd';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import { getConditionalComponent } from '@/utils/index.tsx';

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
  const PvComponent = ({ visitData }) => {
    const trendValue =
      visitData.totalPageViews! > visitData.pastByMetric?.totalPageViews
        ? visitData.totalPageViews - visitData.pastByMetric?.totalPageViews
        : visitData.pastByMetric?.totalPageViews - visitData.totalPageViews;

    return (
      <>
        {visitData.totalPageViews! > visitData.pastByMetric?.totalPageViews ? (
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            较前一天新增流量
            <span className={styles.trendText}>{trendValue}</span>
          </Trend>
        ) : (
          <Trend
            flag="down"
            style={{
              marginRight: 16,
            }}
          >
            较前一天减少流量
            <span className={styles.trendText}>{trendValue}</span>
          </Trend>
        )}
      </>
    );
  };

  const UvComponent: React.FC = ({ visitData }) => {
    const diff = visitData.uniqueVisitors - (visitData.pastByMetric?.uniqueVisitors || 0);

    return (
      <div>
        {diff > 0 ? (
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            较前一天新增用户
            <span className={styles.trendText}>{diff}</span>
          </Trend>
        ) : (
          <Trend
            flag="down"
            style={{
              marginRight: 16,
            }}
          >
            较前一天减少用户
            <span className={styles.trendText}>{-diff}</span>
          </Trend>
        )}
      </div>
    );
  };

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
          total={<Field label="" value={visitData.totalPageViews}></Field>}
          footer={<Field label="总用户数" value={visitData.allUsersLength} />}
          contentHeight={46}
        >
          {getConditionalComponent(
            visitData.totalPageViews, // 条件
            UvComponent, // 组件
            { visitData }, // 传递给组件的props
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
          total={() => <Field label="" value={visitData.totalPageViews}></Field>}
          footer={<Field label="今日访问流量" value={visitData.averageStayDuration?.toFixed(2)} />}
          contentHeight={46}
        >
          {getConditionalComponent(
            visitData.totalPageViews, // 条件
            PvComponent, // 组件
            { visitData }, // 传递给组件的props
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
          footer={<Field label="最高访问次数" value={visitData.mostVisitedPageViews} />}
          contentHeight={46}
        >
        {getConditionalComponent(
            visitData.mostVisitedPageId, // 条件
            Area, // 组件
            { visitData }, // 传递给组件的props
          )}
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
