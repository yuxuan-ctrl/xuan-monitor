import {
  EditOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';

import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  List,
  Row,
  Select,
  Tooltip,
  Modal,
  Input,
  Result,
  message,
} from 'antd';
import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import StandardFormRow from './components/StandardFormRow';
import ApplicationForm from './components/StepForm';
import useStyles from './style.style';
import AvatarImg from '../../../../public/icons/avatar.png'; // 引入图片
import api from '@/services/monitor';
import { ProFormInstance } from '@ant-design/pro-components';
const { TextArea } = Input;

const formItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const CardInfo: React.FC<{
  activeUser: React.ReactNode;
  newUser: React.ReactNode;
}> = ({ activeUser, newUser }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.cardInfo}>
      <div>
        <p>活跃用户</p>
        <p>{activeUser}</p>
      </div>
      <div>
        <p>今日用户</p>
        <p>{newUser}</p>
      </div>
    </div>
  );
};

export const Applications: FC<Record<string, any>> = () => {
  const { styles } = useStyles();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState();
  const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>(form);

  const { data: AppData } = useRequest(
    () => api.eventsController.getAppsDashboardDataUsingGet(), // 将 currentDay 转为数字类型（如果API需要数字）
    {
      // 这里设置默认请求时使用的参数
      refreshDeps: [], // 当 currentDay 改变时自动重新发起请求
    },
  );

  const showModal = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setIsSubmit(false);
    formRef?.current?.resetFields();
    setFormData({});
  };

  const onEdit = async (val) => {
    const { data } = await api.systemsController.getSystemsByIdUsingGet({ appId: val.appId });
    setFormData(data);
    setIsEdit(true);
    setOpen(true);
  };

  const onSubmit = async (data) => {
    const rq = !isEdit
      ? api.systemsController.createSystemUsingPost
      : api.systemsController.editSystemUsingPut;
    const res = await rq({ ...data });
    if (res.code === 0) {
      setIsSubmit(true);
      message.success('提交成功');
    }
  };

  const { data, loading, run } = useRequest((values: any) => {
    console.log('form data', values);
    return api.systemsController.getSystemsListUsingGet();
  });

  const list = data || [];

  return (
    <div className={styles.filterCardList}>
      <Card bordered={false}>
        <Form
          onValuesChange={(_, values) => {
            run(values);
          }}
        >
          <StandardFormRow title="筛选项" grid last>
            <Row gutter={24}>
              <Col lg={20} md={20} sm={20} xs={24}>
                <Form.Item {...formItemLayout} name="author" label="用户">
                  <Select
                    placeholder="不限"
                    style={{
                      maxWidth: 200,
                      width: '100%',
                    }}
                    options={[
                      {
                        label: '王昭君',
                        value: 'lisa',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col lg={4} md={4} sm={4} xs={24}>
                <Button type="primary" onClick={showModal}>
                  新建应用
                </Button>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <br />
      <List<API.Systemsduixiang>
        rowKey="id"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{
                paddingBottom: 20,
              }}
              actions={[
                <Tooltip key="edit" title="编辑">
                  <EditOutlined onClick={() => onEdit(item)} />
                </Tooltip>,
              ]}
            >
              <Card.Meta avatar={<Avatar size="small" src={AvatarImg} />} title={item.appName} />
              <div>
                <CardInfo
                  activeUser={AppData?.activeUserMap[item.appId] || 0}
                  newUser={AppData?.todayUserMap[item.appId] || 0}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={`${isEdit ? '修改' : '创建'}应用`}
        open={open}
        confirmLoading={confirmLoading}
        footer={null}
        onCancel={handleCancel}
      >
        {!isSubmit ? (
          <ApplicationForm
            setIsSubmit={setIsSubmit}
            formRef={formRef}
            formData={formData}
            onSubmit={onSubmit}
            isEdit={isEdit}
          />
        ) : (
          <Result
            status="success"
            title={`应用${isEdit ? '修改' : '创建'}成功!`}
            subTitle="请复制以下SDK至项目内，并按照文档初始化Front Insight监控"
            extra={<TextArea showCount maxLength={100} placeholder="can resize" />}
          />
        )}
      </Modal>
    </div>
  );
};
export default Applications;
