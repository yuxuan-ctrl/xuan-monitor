import { Pie } from '@ant-design/plots';
import { Card, Radio, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import numeral from 'numeral';
import React from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
const { Text } = Typography;
const ProportionSales = ({
  handleGroup,
  salesType,
  loading,
  errorsTypeList,
  handleChangeSalesType,
}: {
  loading: boolean;
  handleGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  errorsTypeList: any[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  console.log('🚀 ~ errorsTypeList:', errorsTypeList);
  const { styles } = useStyles();
  const config = {
    appendPadding: 10,
    data: errorsTypeList,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="错误类别占比"
      style={{
        height: '100%',
      }}
    >
      <div>
        <Pie {...config} />
        {/* <Pie
          height={340}
          radius={0.8}
          innerRadius={0.5}
          angleField="value"
          colorField="type"
          data={errorsTypeList as any}
          legend={false}
          label={{
            position: 'spider',
            text: (item: { type: number; value: number }) => {
              return `${item.type}: ${numeral(item.value).format('0,0')}`;
            },
          }}
        /> */}
      </div>
    </Card>
  );
};
export default ProportionSales;
