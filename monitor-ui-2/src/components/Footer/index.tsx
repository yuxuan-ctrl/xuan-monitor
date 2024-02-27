import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Front Insight',
          title: 'Front Insight',
          href: 'xxx',
          blankTarget: true,
        }
      ]}
    />
  );
};

export default Footer;
