/*
 * @Author: yuxuan-ctrl
 * @Date: 2024-01-31 17:54:23
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-01 08:53:19
 * @FilePath: \monitor-sdk\src\core\interaction\input.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

export let state = [];

import { target } from '../../utils';
import { Listener, EventManager } from '../../decorator';

export default class InputTracker extends EventManager {
  static type = 'input';
  constructor() {
    super();
  }

  @Listener('input')
  public async handler(event: any) {
    let input = target(event) as HTMLInputElement;
    // let value = get(input);
    if (input && input.type) {
      let v = input.value;
      switch (input.type) {
        case 'radio':
        case 'checkbox':
          v = input.checked ? 'true' : 'false';
          break;
      }

      let data = { target: input, value: v };

      console.log('🚀 ~ ClickTracker ~ handler ~ data:', data);
      // If last entry in the queue is for the same target node as the current one, remove it so we can later swap it with current data.
      if (
        state.length > 0 &&
        state[state.length - 1].data.target === data.target
      ) {
        state.pop();
      }

      // state.push({ time: getTime(event), event: Event.Input, data });

      // clearTimeout(timeout);
      // timeout = setTimeout(process, Setting.InputLookAhead, Event.Input);
    }
  }
}
