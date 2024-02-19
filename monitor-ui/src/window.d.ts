/*
 * @Author: yuxuanli
 * @Date: 2024-01-16 18:04:08
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 15:52:47
 * @FilePath: \monitor-ui\src\window.d.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {UserCenterApiAPIs} from "@/sdk/userCenterApi/spec";
import {Monitor} from "./services/sdk/api";
declare global {
  interface Window {
    APIS: Monitor;
    Monitor: Monitor;
  }
}

interface Window {
  APIS: Monitor;
  Monitor: Monitor;
}
