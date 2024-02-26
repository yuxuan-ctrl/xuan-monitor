import { ProList } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRequest } from '@umijs/max';
import { useState, type FC } from 'react';
import api from '@/services/monitor';
import AvatarImg from '../../../public/icons/avatar.png'; // 引入图片

const Errors: FC = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  // Request
  const { loading, data } = useRequest(() => api.errorsController.getPageDataUsingGet(pagination), {
    // 这里设置默认请求时使用的参数
    refreshDeps: [pagination.pageIndex],
  });

  console.log('🚀 ~ data:', data);

  //methods
  const paginationChange = (val) => {
    setPagination((prev) => {
      return { ...prev, pageIndex: val };
    });
  };
  return (
    <ProList<API.Errors>
      // toolBarRender={() => {
      //   return [
      //     <Button key="3" type="primary">
      //       新建
      //     </Button>,
      //   ];
      // }}
      search={{}}
      rowKey="name"
      headerTitle="基础列表"
      dataSource={data?.records || []}
      pagination={{
        total: data?.total,
        pageSize: 10,
        onChange: paginationChange,
      }}
      showActions="hover"
      metas={{
        title: {
          dataIndex: 'userId',
          title: '用户',
        },
        avatar: {
          dataIndex: 'avatar',
          search: false,
          render: (text) => {
            return <img src={AvatarImg} style={{ width: '20px', height: '20px' }}></img>;
          },
        },
        description: {
          dataIndex: 'errorMessage',
          search: false,
        },
        subTitle: {
          dataIndex: 'errorType',
          render: (_, row) => {
            console.log('🚀 ~ row:', row);
            return (
              <Space size={0}>
                <Tag color="blue" key={row.esErrorId}>
                  {row.errorType}
                </Tag>
              </Space>
            );
          },
          search: false,
        },
        actions: {
          render: (text, row) => [
            <a href={row.url} target="_blank" rel="noopener noreferrer" key="link">
              链路
            </a>,
            <a href={row.url} target="_blank" rel="noopener noreferrer" key="warning">
              报警
            </a>,
            <a href={row.url} target="_blank" rel="noopener noreferrer" key="view">
              查看
            </a>,
          ],
          search: false,
        },
        status: {
          // 自己扩展的字段，主要用于筛选，不在列表中显示
          title: '状态',
          valueType: 'select',
          valueEnum: {
            all: { text: '全部', status: 'Default' },
            open: {
              text: '未解决',
              status: 'Error',
            },
            closed: {
              text: '已解决',
              status: 'Success',
            },
            processing: {
              text: '解决中',
              status: 'Processing',
            },
          },
        },
      }}
    />
  );
};

export default Errors;
