import { addEventListener } from "../utils/utils.js";
import { PageViewData } from "../types";
import MessageQueueDBWrapper from "./message.js";
import { DB_CONFIG } from "../config/dbconfig.js";
export default class Monitor {
  pageShowTime: number = 0;
  duration: number = 0;
  report: Report;
  userId: string = "";
  messageQueue: MessageQueueDBWrapper;

  constructor(config) {
    // this.report = new Report(config);
    this.listenToPageData();
    this.listenError();
    this.messageQueue = MessageQueueDBWrapper.getInstance(
      DB_CONFIG.DB_NAME,
      1,
      "pvStore"
    );
    console.log(
      "🚀 ~ file: monitor.ts:22 ~ Monitor ~ constructor ~ this.messageQueue:",
      this.messageQueue
    );
  }

  trackPageView() {
    const pageViewData: PageViewData = {
      userId: this.userId,
      pageShowTime: performance.now(),
      duration: this.duration,
      timestamp: 0,
      pagePath: "",
      appId: "",
      ipAddress: "",
      userAgent: "",
      browser: "",
      os: "",
    };
    this.messageQueue.enqueue(pageViewData);
  }

  listenToPageData() {
    const endUpPageShow = addEventListener("pageshow", document, () => {
      this.pageShowTime = performance.now();
      this.trackPageView();
    });
    const endUpPageHide = addEventListener("pagehide", document, () => {
      this.duration = performance.now() - this.pageShowTime;
      this.trackPageView();
    });
    const endUpPageReplace = addEventListener("replaceState", document, () => {
      this.duration = performance.now() - this.pageShowTime;
      this.pageShowTime = performance.now();
    });
    return {
      endUpPageShow,
      endUpPageHide,
      endUpPageReplace,
    };
  }

  listenError() {
    const endError = addEventListener("error", document, (err: any) => {
      const errorInfo = {
        errFileName: err.filename,
        message: err.error.message,
      };
    });
    const endUpRejection = addEventListener(
      "unhandledrejection",
      document,
      () => {
        this.duration = performance.now() - this.pageShowTime;
      }
    );
    return {
      endError,
      endUpRejection,
    };
  }
}
