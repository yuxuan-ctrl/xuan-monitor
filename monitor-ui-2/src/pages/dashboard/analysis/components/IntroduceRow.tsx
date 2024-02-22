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
const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: API.Metrics }) => {
  const { styles } = useStyles();
  return (
    <Row gutter={24}>
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

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="独立访客数"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={visitData.uniqueVisitors}
          footer={<Field label="今日访问量" value={numeral(1234).format('0,0')} />}
          contentHeight={46}
        >
            <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            今日新增用户数
            {/* todo 今日新增用户数*/}
            <span className={styles.trendText}>12</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="页面浏览量"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={visitData.totalPageViews}
          footer={<Field label="平均停留时间" value={visitData.averageStayDuration?.toFixed(2)} />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="运营活动效果"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total="78%"
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend
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
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <Progress percent={78} strokeColor={{ from: '#108ee9', to: '#87d068' }} status="active" />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
