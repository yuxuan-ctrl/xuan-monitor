/*
 * @Author: yuxuan-ctrl 
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-06-14 09:35:01
 * @FilePath: \monitor-ui\src\index.tsx
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import ReactDOM from "react-dom";
import "./index.css";
// import reportWebVitals from "./reportWebVitals";
import App from "./App";
import EasyAgentSDK from '@/utils/reportsdk'


new EasyAgentSDK();
// 18
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
 
// 17
ReactDOM.render(
  <App />, document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
