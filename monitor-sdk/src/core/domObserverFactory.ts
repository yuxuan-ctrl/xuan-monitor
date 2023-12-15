export default class DOMObserverFactory {
  private static instances: Record<string, DOMObserver> = {};

  static getInstance(
    mode: "singleton" | "prototype",
    identifier: string
  ): DOMObserver | undefined {
    if (mode === "singleton" && this.instances[identifier]) {
      return this.instances[identifier];
    } else if (mode === "prototype") {
      return new DOMObserver();
    } else {
      throw new Error(
        "Invalid mode provided, expected 'singleton' or 'prototype'"
      );
    }
  }
}

type CallbackFn = (
  mutationsList: MutationRecord[],
  observer: MutationObserver
) => void;

class DOMObserver {
  private observer: MutationObserver;

  constructor(
    private config?: MutationObserverInit,
    private callback?: CallbackFn
  ) {}

  start(targetNode: Node): void {
    this.observer.observe(targetNode, this.config);
  }

  stop(): void {
    this.observer.disconnect();
  }

  restart(): void {
    this.stop();
    this.start(this.observer.takeRecords()[0]?.target ?? document.body);
  }
}
