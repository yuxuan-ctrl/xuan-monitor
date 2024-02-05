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
}

export default class MessageQueueDBWrapper extends IndexedDBWrapper {
  // 消息存储名称
  private static readonly MESSAGE_STORE_NAME = 'messages';
  // 实例
  private static _instance: MessageQueueDBWrapper | null = null;

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
    };
    await this.add(message, storeName);
  }

  // 获取消息
  public async dequeue(storeName): Promise<IMessage | undefined> {
    const messages = await this.getAll(storeName);
    if (messages.length > 0) {
      const newestPendingMessage = messages
        .filter((mes) => {
          return mes.status === 'pending';
        })
        .sort((a, b) => a.timestamp - b.timestamp)[0];
      if (newestPendingMessage.status === 'pending') {
        await this.update(
          newestPendingMessage.id!,
          { status: 'consumed' },
          storeName
        );
        return newestPendingMessage;
      }
    }
    return undefined;
  }
}
