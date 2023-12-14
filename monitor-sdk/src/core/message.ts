import IndexedDBWrapper from "../db/index.js";

interface IMessage {
  id?: number;
  data?: any;
  timestamp?: number;
  status?: "pending" | "consumed";
}

export default class MessageQueueDBWrapper extends IndexedDBWrapper {
  // 消息存储名称
  private static readonly MESSAGE_STORE_NAME = "messages";
  // 实例
  static instance: MessageQueueDBWrapper;

  constructor(dbName: string, version: number, storeName: string) {
    super(
      dbName,
      version,
      storeName || MessageQueueDBWrapper.MESSAGE_STORE_NAME
    );
  }

  // 获取实例
  public static getInstance(
    dbName: string,
    dbVersion: number,
    storeName: string
  ): MessageQueueDBWrapper {
    if (!window.instance) {
      this.instance = new MessageQueueDBWrapper(dbName, dbVersion, storeName);
      window.instance = this.instance;
    }
    return window.instance;
  }

  // 添加消息
  public async enqueue(data: any): Promise<void> {
    const timestamp = Date.now();
    const message: IMessage = { ...data, timestamp, status: "pending" };
    await this.add(message);
  }

  // 获取消息
  public async dequeue(): Promise<IMessage | undefined> {
    const pendingMessages = await this.query(
      (message) => message.status === "pending"
    );
    if (pendingMessages.length > 0) {
      const newestPendingMessage = pendingMessages.reduce((newest, current) =>
        current.timestamp > newest.timestamp ? current : newest
      );
      await this.update(newestPendingMessage.id!, { status: "consumed" });
      return newestPendingMessage;
    }
    return undefined;
  }
}
