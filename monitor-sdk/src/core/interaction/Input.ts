/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-01-31 17:54:23
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-20 11:23:42
 * @FilePath: \monitor-sdk\src\core\interaction\input.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

export let state = [];

import { getCurrentUnix, getTime, target, formatDate } from '../../utils';
import { Listener, EventManager } from '../../decorator';
import MessageQueueDBWrapper from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';

export default class InputTracker extends EventManager {
  type = 'input';
  constructor() {
    super();
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.ACTION_STORE_NAME,
    });
  }

  @Listener('input')
  public async handler(event: any) {
    let input = target(event) as HTMLInputElement;
    if (input && input.type) {
      let v = input.value;
      switch (input.type) {
        case 'radio':
        case 'checkbox':
          v = input.checked ? 'true' : 'false';
          break;
      }
      console.dirxml('🚀 ~ InputTracker ~ handler ~ data.input:', input);

      let data = {
        target: JSON.stringify(input),
        value: v,
        type: this.type,
        timestamp: getCurrentUnix(),
      };

      console.log('🚀 ~ ClickTracker ~ handler ~ data:', data);
      // If last entry in the queue is for the same target node as the current one, remove it so we can later swap it with current data.
      if (
        state.length > 0 &&
        state[state.length - 1].data.target === data.target
      ) {
        state.pop();
      }

      this.messageWrapper.enqueue(
        {
          timestamp: getCurrentUnix(),
          createTime: formatDate(new Date()),
          // event: event,
          type: this.type,
          data: JSON.stringify(data),
          session: new Date().getDate(),
        },
        DB_CONFIG.ACTION_STORE_NAME
      );
      // state.push({ time: getTime(event), event: Event.Input, data });

      // clearTimeout(timeout);
      // timeout = setTimeout(process, Setting.InputLookAhead, Event.Input);
    }
  }
}
