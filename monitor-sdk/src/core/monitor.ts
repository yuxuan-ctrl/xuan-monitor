import { addEventListener } from "@/utils/utils";
import { Report } from "./report";
export class Monitor {
  pageShowTime: number = 0;
  timeOnPage: number = 0;
  report: Report;
  constructor(config) {
    this.listenToPageData();
    this.listenError();
  }

  listenToPageData() {
    const endUpPageShow = addEventListener("pageshow", document, () => {
      this.pageShowTime = performance.now();
    });
    const endUpPageHide = addEventListener("pagehide", document, () => {
      this.timeOnPage = performance.now() - this.pageShowTime;
    });
    const endUpPageReplace = addEventListener("replaceState", document, () => {
      this.timeOnPage = performance.now() - this.pageShowTime;
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
        this.timeOnPage = performance.now() - this.pageShowTime;
      }
    );
    return {
      endError,
      endUpRejection,
    };
  }
}
