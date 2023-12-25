import html2canvas from "html2canvas";

interface ExtendedError extends Error {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export default class ErrorTracker {
  operationSequence: any;
  logContext: any;
  errors: any;
  constructor() {
    this.errors = [];
    this.operationSequence = [];
    this.logContext = {};
  }

  async captureScreenshot() {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      try {
        // 使用 HTML2Canvas 库来生成屏幕截图（需要先安装 html2canvas）
        html2canvas(document.body, {
          allowTaint: true,
          useCORS: true,
          scale: window.devicePixelRatio || 1,
          width: canvas.width,
          height: canvas.height,
        })
          .then((canvas) => {
            resolve(canvas.toDataURL());
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  collectOperation(operation) {
    this.operationSequence.push(operation);
  }

  clearOperationSequence() {
    this.operationSequence = [];
  }

  setLogContext(context) {
    this.logContext = context;
  }

  clearLogContext() {
    this.logContext = {};
  }

  async collectError(error: ExtendedError | string) {
    let errorInfo;
    if (error instanceof Error) {
      errorInfo = {
        type: error.name,
        message: error.message,
        stackTrace: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        fileName: error.fileName || "",
        lineNumber: error.lineNumber || "",
        columnNumber: error.columnNumber || "",
        operationSequence: this.operationSequence.slice(),
        logContext: this.logContext,
      };
    } else if (typeof error === "string") {
      // 对于字符串类型的错误，我们假设它是网络错误或其他非 JavaScript 错误
      errorInfo = {
        type: "Non-JavaScript Error",
        message: error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        operationSequence: this.operationSequence.slice(),
        logContext: this.logContext,
      };
    } else {
      errorInfo = {
        type: "Unexpected Error",
        message: error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        operationSequence: this.operationSequence.slice(),
        logContext: this.logContext,
      };
    }

    try {
      errorInfo.screenshot = await this.captureScreenshot();
    } catch (screenshotError) {
      console.error("Error capturing screenshot:", screenshotError);
    }

    return errorInfo;
    // this.clearOperationSequence();
    // this.clearLogContext();
  }
}
