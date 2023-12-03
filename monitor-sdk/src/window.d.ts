import { QueueEventType } from "./types/index";

declare global {
  interface Window {
    eventQueue: QueueEventType[];
  }
}

interface Window {
  eventQueue: QueueEventType[];
}
