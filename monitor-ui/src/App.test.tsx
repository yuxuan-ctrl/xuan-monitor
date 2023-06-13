/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-13 18:09:39
 * @FilePath: \monitor-ui\src\App.test.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// 测试SDK是否能通过
describe('monitor sdk', () => {
  it('monitor sdk correctly', () => {
    const EasyAgentSDK = require('@/utils/reportSDK');
    console.log("🚀 ~ file: index.test.ts:16 ~ it ~ EasyAgentSDK:", EasyAgentSDK)
  });
});