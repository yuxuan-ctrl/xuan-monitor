/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-11 15:04:54
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2024-02-07 14:04:03
 * @FilePath: \monitor-sdk\src\decorator\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { createUUid } from '../utils';
import MessageQueueDBWrapper, { IMessage } from '../core/Message';
import { DB_CONFIG } from '../config/dbconfig';

type EventConfig = string | string[];

export class EventManager {
  public _registeredEvents: Map<string, { element: any; method: Function }> =
    new Map();
  messageWrapper: MessageQueueDBWrapper;

  private manageEventListener(
    action: 'add' | 'remove',
    Class: any,
    root?: Element,
    eventName?: string
  ): void {
    const element = root || document;
    const methods = Object.getOwnPropertyNames(Class).filter(
      (methodName) => methodName !== 'constructor'
    );
    console.log(this);

    methods.forEach((methodName) => {
      const method = Class[methodName].bind(this);
      const eventConfig = Reflect.getMetadata('eventConfig', Class, methodName);
      console.log(eventConfig);
      if (eventConfig && typeof method === 'function') {
        if (Array.isArray(eventConfig)) {
          eventConfig.forEach((name) => {
            if (!eventName || name === eventName) {
              this._processEvent(action, name, element, method);
            }
          });
        } else if (!eventName || eventConfig === eventName) {
          this._processEvent(action, eventConfig, element, method);
        }
      }
    });
  }

  private _processEvent(
    action: 'add' | 'remove',
    eventName: string,
    element: any,
    method: any
  ) {
    const registeredEvent = this._registeredEvents.get(
      eventName + element.eventId
    );
    if (action === 'add') {
      if (!registeredEvent || registeredEvent.element !== element) {
        element.addEventListener(eventName, method);
        this._registerEvent(eventName, element, method);
      }
    } else if (action === 'remove') {
      if (registeredEvent?.element === element) {
        this._registeredEvents.delete(eventName + element.eventId);
        element.removeEventListener(
          eventName,
          registeredEvent.method as EventListenerOrEventListenerObject
        );
      }
    }
  }

  private _registerEvent(
    eventName: string,
    element: any,
    method: Function
  ): void {
    element.eventId = createUUid();
    this._registeredEvents.set(eventName + element.eventId, {
      element,
      method,
    });
  }

  // 修改 start 和 stop 方法调用新的公共方法
  public start(root?: Element): void {
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.ACTION_STORE_NAME,
    });
    this.manageEventListener('add', Object.getPrototypeOf(this), root);
  }

  public stop(root?: Element): void {
    this.manageEventListener('remove', Object.getPrototypeOf(this), root);
  }
}

export function Listener(config: EventConfig) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('eventConfig', config, target, propertyKey);
    return descriptor;
  };
}
