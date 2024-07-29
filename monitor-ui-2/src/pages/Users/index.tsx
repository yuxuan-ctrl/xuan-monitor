import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest, history, FormattedMessage, useIntl } from '@umijs/max';
import { useState, type FC, useRef } from 'react';
import api from '@/services/monitor';

const Users: FC = () => {
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [userId, setUserId] = useState('');
  // Request
  const { loading, data } = useRequest(
    () => api.userController.getUserPageUsingGet({ ...pagination,userId }),
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [pagination.pageIndex,userId],
    },
  );

  // const getPageData = () => {
  //   return api.userController.getUserPageUsingGet({ ...pagination });
  // };

  console.log('🚀 ~ data:', data);

  //methods
  const gotoFun = (type, row) => {
    console.log('🚀 ~ gotoFun ~ row:', row);
    switch (type) {
      case 'details':
        history.push('/users/details', { userId: row.userId });
        break;
    }
  };

  const columns: ProColumns<API.Users>[] = [
    {
      title: (
        <FormattedMessage id="pages.searchTable.updateForm.userIdLabel" defaultMessage="User ID" />
      ),
      dataIndex: 'userId',
      tip: 'The user ID is the unique identifier',
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.createTimeLabel" defaultMessage="Creation Time" />
      ),
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.lastLoginTimeLabel"
          defaultMessage="Last Login Time"
        />
      ),
      dataIndex: 'lastLoginTime',
      sorter: true,
      valueType: 'dateTime',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.ipAddressLabel" defaultMessage="IP Address" />,
      dataIndex: 'ipAddress',
      hideInForm: true,
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.platformLabel" defaultMessage="Platform" />,
      dataIndex: 'platform',
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.userAgentLabel" defaultMessage="User Agent" />,
      dataIndex: 'userAgent',
      hideInForm: true,
      search: false,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, row) => [
        <a
          key="config"
          onClick={() => {
            gotoFun('details', row);
          }}
        >
          <FormattedMessage id="pages.searchTable.userDetail" defaultMessage="详情" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Users, API.getUserPageUsingGETParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="userId"
        search={{
          labelWidth: 120,
        }}
        beforeSearchSubmit={async (params) => {
          setUserId(params.userId)
        }}
        dataSource={data?.content}
        columns={columns}
      />
    </PageContainer>
  );
};

export default Users;
