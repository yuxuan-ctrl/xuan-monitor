import { AnyObject, BaseEventType, QueueEventType } from "./types";
import { createUUid } from "./utils";

/**
 * @description: 事件队列管理器
 */
export class EventQueueManager {
  QUEUE: QueueEventType[] = [];
  constructor() {
    // 单列模式，一个window对象下只能有一个队列管理器
    if (window.eventQueue) {
      this.QUEUE = window.eventQueue;
      return;
    }
    window.eventQueue = this.QUEUE;
  }
  /**
   * @description: 添加事件
   * @param {T} event
   * @return {*}
   */
  push(event: AnyObject) {
    const baseEvent = this.createBaseEvent();
    this.QUEUE.push({
      ...baseEvent,
      ...event,
    });
    console.log(
      "🚀 ~ file: eventQueueManager.ts:28 ~ EventQueueManager ~ push ~ this.QUEUE:",
      this.QUEUE
    );
    return this.QUEUE;
  }

  /**
   * @description: 清除事件队列
   */
  clearQueue() {
    this.QUEUE = [];
    return this.QUEUE;
  }

  /**
   * @description: 创建基本事件
   */
  createBaseEvent(config?: BaseEventType): BaseEventType {
    const baseEvent = {
      timestamp: new Date().getTime(),
      uuid: createUUid(),
      pageUrl: window.location.href,
      type: "event",
    };
    // 如果传来config，就初始化默认的事件
    if (config) {
      Object.assign(baseEvent, config);
    }
    return baseEvent;
  }
}
