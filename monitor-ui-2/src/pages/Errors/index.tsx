import { ProList } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRequest, history } from '@umijs/max';
import { useState, type FC } from 'react';
import api from '@/services/monitor';
import AvatarImg from '../../../public/icons/avatar.png'; // 引入图片

const Errors: FC = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [userId, setUserId] = useState('');
  // Request
  const { loading, data } = useRequest(() => api.errorsController.getPageDataUsingGet({...pagination,userId}), {
    // 这里设置默认请求时使用的参数
    refreshDeps: [pagination.pageIndex,userId],
  });

  console.log('🚀 ~ data:', data);

  //methods
  const paginationChange = (val) => {
    setPagination((prev) => {
      return { ...prev, pageIndex: val };
    });
  };

  const gotoFun = (type, row) => {
    console.log('🚀 ~ gotoFun ~ row:', row);
    switch (type) {
      case 'details':
        history.push('/errors/details', { id: row.esErrorId });
        break;
    }
  };
  return (
    <ProList<API.Errors>
      search={{}}
      request={(val) => {
        console.log("🚀 ~ val:", val)
        setUserId(val?.userId)
      }}
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
            <a key="view" onClick={() => gotoFun('details', row)}>
              查看
            </a>,
          ],
          search: false,
        },
        // status: {
        //   // 自己扩展的字段，主要用于筛选，不在列表中显示
        //   title: '状态',
        //   valueType: 'select',
        //   valueEnum: {
        //     all: { text: '全部', status: 'Default' },
        //     open: {
        //       text: '未解决',
        //       status: 'Error',
        //     },
        //     closed: {
        //       text: '已解决',
        //       status: 'Success',
        //     },
        //     processing: {
        //       text: '解决中',
        //       status: 'Processing',
        //     },
        //   },
        // },
      }}
    />
  );
};

export default Errors;
