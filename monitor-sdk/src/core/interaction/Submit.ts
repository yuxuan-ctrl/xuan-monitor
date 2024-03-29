/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-02-01 09:16:27
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-29 14:53:17
 * @FilePath: \monitor-sdk\src\core\interaction\submit.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { Listener, EventManager } from '../../decorator';
import { getTime, target,getCurrentUnix } from '../../utils';
import MessageQueueDBWrapper from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';
export let data = null;

export default class SubmitTracker extends EventManager {
  type = 'submit';
  constructor() {
    super();
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.ACTION_STORE_NAME,
    });
  }

  @Listener('submit')
  handler(event) {
    (data = {
      time: getTime(event),
      value: event.target.value,
      type: this.type,
      timestamp: getCurrentUnix(),
    }),
      this.messageWrapper.enqueue(
        { ...data, session: new Date().getDate() },
        DB_CONFIG.ACTION_STORE_NAME
      );
  }
}
