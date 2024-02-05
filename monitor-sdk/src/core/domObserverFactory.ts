/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-18 09:17:00
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-19 08:59:53
 * @FilePath: \monitor-sdk\src\core\domObserverFactory.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export default class DOMObserverFactory {
  private static instances: Record<string, DOMObserver> = {};

  static getInstance(
    mode: 'singleton' | 'prototype',
    identifier: string,
  ): DOMObserver | undefined {
    if (mode === 'singleton' && this.instances[identifier]) {
      return this.instances[identifier];
    } else if (mode === 'prototype') {
      return new DOMObserver();
    } else {
      throw new Error(
        "Invalid mode provided, expected 'singleton' or 'prototype'",
      );
    }
  }

  static createSingletonInstance(
    identifier: string,
    config: MutationObserverInit,
    callback: CallbackFn,
  ): void {
    if (!this.instances[identifier]) {
      this.instances[identifier] = new DOMObserver(config, callback);
    }
  }
}

type CallbackFn = (
  mutationsList: MutationRecord[],
  observer: MutationObserver,
) => void;

class DOMObserver {
  private observer: MutationObserver;

  constructor(
    private config?: MutationObserverInit,
    private callback?: CallbackFn,
  ) {
    this.observer = new MutationObserver(this.callback || (() => {}));
    if (this.config) {
      this.observer.observe(document.body, this.config);
    }
  }

  start(targetNode: Node): void {
    this.observer.observe(targetNode, this.config);
  }

  stop(): void {
    this.observer.disconnect();
  }

  restart(targetNode?: Node): void {
    this.stop();
    if (targetNode) {
      this.start(targetNode);
    } else {
      this.start(this.observer.takeRecords()[0]?.target ?? document.body);
    }
  }
}
