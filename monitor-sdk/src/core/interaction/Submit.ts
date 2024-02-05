/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-01 09:16:27
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-02 14:45:02
 * @FilePath: \monitor-sdk\src\core\interaction\submit.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { Listener, EventManager } from '../../decorator';
import { getTime, target } from '../../utils';

export let data = null;

export default class SubmitTracker extends EventManager {
  static type = 'submit';
  constructor() {
    super();
  }

  @Listener('submit')
  handler(event) {
    data = { time: getTime(event), data: { target: target(event) } };
    console.log('🚀 ~ ResizeTracker ~ handler ~ data:', data);
  }
}
