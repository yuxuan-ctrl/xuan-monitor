import { QueueEventType } from './index';

declare global {
  interface Window {
    eventQueue: QueueEventType[];
    indexedDB: LocalForage;
  }
}

interface Window {
  eventQueue: QueueEventType[];
  indexedDB: LocalForage;
}
