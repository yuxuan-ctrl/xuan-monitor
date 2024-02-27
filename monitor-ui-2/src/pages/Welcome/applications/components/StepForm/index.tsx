import { APPLICATION_TYPES } from '@/enums/ApplicationEnum';
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  ProForm,
} from '@ant-design/pro-components';
import { useEffect } from 'react';

const ApplicationForm = ({ setIsSubmit, formData, isEdit, formRef, onSubmit }) => {
  useEffect(() => {
    console.log('🚀 ~ useEffect ~ formData:', formData);
    if (formData) {
      formRef.current?.setFieldsValue({
        appId: formData.appId,
        appName: formData.appName,
        appType: formData.appType,
      });
    }
    console.log('🚀 ~ ApplicationForm ~ formRef:', formRef);
  }, [formData]);
  return (
    <ProCard>
      <ProForm<{
        name: string;
      }>
        formRef={formRef}
        onFinish={async (data) => {
          onSubmit(data);
        }}
      >
        <ProForm.Item name="base">
          {isEdit && <ProFormText name="appId" label="应用Id" width="md" disabled={true} />}
          <ProFormText
            name="appName"
            label="应用名称"
            width="md"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="appType"
            label="应用类型"
            width="md"
            tooltip="应用框架选择(Broswer类型是默认SDK)"
            options={APPLICATION_TYPES}
            rules={[{ required: true }]}
          ></ProFormSelect>
        </ProForm.Item>
        <ProForm.Item name="checkbox"></ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

export default ApplicationForm;
