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
import { Listener, EventManager } from '../../decorator';
import MessageQueueDBWrapper, { IMessage } from '../Message';
import { DB_CONFIG } from '../../config/dbconfig';

export let data = null;

export default class SelectTracker extends EventManager {
  type = 'selectionchange';
  constructor() {
    super();
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.ACTION_STORE_NAME,
    });
  }

  @Listener('selectionchange')
  handler(root) {
    console.log('🚀 ~ ResizeTracker ~ handler ~ root:', root);
    let doc = document;
    let current = doc.getSelection();
    console.log('🚀 ~ ResizeTracker ~ handler ~ current:', current);

    // Bail out if we don't have a valid selection
    if (current === null) {
      return;
    }

    // Bail out if we got a valid selection but not valid nodes
    // In Edge, selectionchange gets fired even on interactions like right clicks and
    // can result in null anchorNode and focusNode if there was no previous selection on page
    // Also, ignore any selections that start and end at the exact same point
    if (
      (current.anchorNode === null && current.focusNode === null) ||
      (current.anchorNode === current.focusNode &&
        current.anchorOffset === current.focusOffset)
    ) {
      return;
    }
    // let startNode = data.start ? data.start : null;
    // if (
    //   previous !== null &&
    //   data.start !== null &&
    //   startNode !== current.anchorNode
    // ) {
    //   clearTimeout(timeout);
    // }

    data = {
      start: current.anchorNode,
      startOffset: current.anchorOffset,
      end: current.focusNode,
      endOffset: current.focusOffset,
      type: this.type,
    };
    console.log('🚀 ~ ResizeTracker ~ handler ~ data:', data);
    this.messageWrapper.enqueue(
      { ...data, session: new Date().getDate() },
      DB_CONFIG.ACTION_STORE_NAME
    );
  }
}
