/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-08-08 14:19:38
 * @FilePath: \xuan-monitor\monitor-sdk\src\core\Message.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { IMessage } from '../types';
import IndexedDBWrapper from '../db/index';
import { getCurrentUnix } from '../utils';
import { DB_CONFIG } from '../config/dbconfig';

const {
  TRAFFIC_STORE_NAME,
  Error_STORE_NAME,
  ACTION_STORE_NAME,
  RECORD_STORE_NAME,
  INTERFACE_STORE_NAME,
} = DB_CONFIG;

export default class MessageQueueDBWrapper extends IndexedDBWrapper {
  // 实例
  private static _instance: MessageQueueDBWrapper | null = null;
  private maxMessageCount = 100;
  constructor(config) {
    super(config);
  }

  // 获取实例
  public static getInstance(config: {
    dbName: string;
    dbVersion: number;
    storeName: string;
  }): MessageQueueDBWrapper {
    if (!MessageQueueDBWrapper._instance) {
      MessageQueueDBWrapper._instance = new MessageQueueDBWrapper({
        dbName: config.dbName,
        dbVersion: config.dbVersion,
        storeName: config.storeName,
      });
    }
    return MessageQueueDBWrapper._instance;
  }

  // 添加消息
  public async enqueue(data: any, storeName): Promise<void> {
    const message: IMessage = {
      data,
      timestamp: getCurrentUnix(),
      status: storeName === TRAFFIC_STORE_NAME ? 'enter' : 'pending',
      pageUrl: data.pageUrl,
    };
    await this.add(message, storeName);
  }

  // 获取消息
  public async dequeue(storeName): Promise<IMessage[] | undefined> {
    const condition = (item) => {
      return item.status === 'pending';
    };
    const messages = await this.query(
      condition,
      storeName,
      {
        field: 'timestamp',
        direction: 'asc',
      },
      this.maxMessageCount
    );
    if (messages.length > 0) {
      return messages;
    }

    return undefined;
  }

  public async findLatestPage(storeName) {
    const condition = (item) => {
      return item.status === 'enter';
    };
    const messages = await this.query(
      condition,
      storeName,
      {
        field: 'timestamp',
        direction: 'desc',
      },
      1
    );
    if (messages.length > 0) {
      return messages[0];
    }

    return undefined;
  }

  public updateStatus(id, storeName, status) {
    this.update(id, { status }, storeName);
  }

  public async batchDeleteBeforeDate(
    storeNameList: string[],
    hoursAgo: number
  ): Promise<void> {
    const db = await this.ensureDatabaseOpen();
    for (const storeName of storeNameList) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        // 获取当前时间戳，并计算7天前的时间戳
        const todayTimestamp = Date.now();
        const thresholdTimestamp = todayTimestamp - hoursAgo * 60 * 60 * 1000;

        // 创建一个索引（如果还没有的话），用于根据日期字段进行查询
        const index = objectStore.index('timestamp');

        // 执行一个范围查询以获取所有小于阈值时间戳的记录
        const range = IDBKeyRange.upperBound(thresholdTimestamp);
        const cursorRequest = index.openCursor(range);

        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as any)?.result;
          if (cursor) {
            const item = cursor.value;
            if (item.status === 'consumed') {
              // 删除符合条件的记录
              cursor.delete();
            }
            cursor.continue(); // 移动到下一个记录
          }
        };

        cursorRequest.onerror = (event) => {
          reject(
            `Failed to batch delete data from store ${storeName}: ${(event.target as any)?.error}`
          );
        };
      });
    }

    // 所有store处理完毕后才resolve
    return Promise.resolve();
  }
}
