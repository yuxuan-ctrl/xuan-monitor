/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-05 10:24:50
 * @FilePath: \monitor-sdk\src\core\Message.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import IndexedDBWrapper from '../db/index';

export interface IMessage {
  data?: any;
  timestamp?: any;
  id?: number;
  name?: string;
  age?: number;
  email?: string;
  status?: 'pending' | 'consumed';
  userId?: string;
  pageUrl?: string;
  userAgent?: string;
  platform?: string;
  screenResolution?: any;
  referrer?: string;
}

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
      timestamp: Date.now(),
      status: 'pending',
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
      messages.forEach(async (mes) => {
        if (mes.status === 'pending') {
          await this.update(mes.id!, { status: 'consumed' }, storeName);
        }
      });

      return messages;
    }
    return undefined;
  }
}
