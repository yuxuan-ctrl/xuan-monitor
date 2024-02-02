/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-01 09:16:27
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-02 09:12:31
 * @FilePath: \monitor-sdk\src\core\interaction\selection.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {Listener} from "../../decorator";
import { getTime, layout, link, target ,text} from "../../utils";

export let data = null;


export default class SubmitTracker {
  constructor() {}

  @Listener("submit")
  handler(event) {

    data = { time: getTime(event), data: { target: target(event) } }
    console.log("🚀 ~ ResizeTracker ~ handler ~ data:", data)
  }
}
