/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 16:49:24
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-11 16:55:05
 * @FilePath: \monitor-sdk\src\test\monitor.test.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// const Monitor = require("../core/monitor");
import { Monitor } from "../Monitor";

describe("Monitor Class test", () => {
  test("listener decorator", () => {
    const monitor = new Monitor({});
    monitor.listenToPageData();
  });
});
