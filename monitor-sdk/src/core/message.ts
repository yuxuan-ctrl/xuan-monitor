import IndexedDBWrapper from "../db/index";

interface IMessage {
  data?: any;
  timestamp?: any;
  id?: number;
  name?: string;
  age?: number;
  email?: string;
  status?: "pending" | "consumed";
}

export default class MessageQueueDBWrapper extends IndexedDBWrapper {
  // 消息存储名称
  private static readonly MESSAGE_STORE_NAME = "messages";
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
  public async enqueue(data: any): Promise<void> {
    const message: IMessage = {
      data,
      timestamp: Date.now(),
      status: "pending",
    };
    await this.add(message);
  }

  // 获取消息
  public async dequeue(): Promise<IMessage | undefined> {
    const messages = await this.getAll();
    if (messages.length > 0) {
      const [newestPendingMessage] = messages.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      if (newestPendingMessage.status === "pending") {
        await this.update(newestPendingMessage.id!, { status: "consumed" });
        return newestPendingMessage;
      }
    }
    return undefined;
  }
}
