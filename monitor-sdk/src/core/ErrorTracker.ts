import { normalizeUrlForPath, formatDate } from '../utils';
import MessageQueueDBWrapper, { IMessage } from './Message';
import { DB_CONFIG } from '../config/dbconfig';
interface ExtendedError extends Error {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export default class ErrorTracker {
  operationSequence: any;
  logContext: any;
  errors: any;
  messageWrapper: MessageQueueDBWrapper;

  constructor() {
    this.errors = [];
    this.operationSequence = [];
    this.logContext = {};
    this.messageWrapper = MessageQueueDBWrapper.getInstance({
      dbName: 'monitorxq',
      dbVersion: 1,
      storeName: DB_CONFIG.RECORD_STORE_NAME,
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

  async getRange(startTime?, endTime?) {
    const condition =
      startTime && endTime
        ? (item) => {
            return (
              +item.timestamp > +startTime &&
              +item.timestamp < +endTime &&
              item.data.path === normalizeUrlForPath(window.location.href)
            );
          }
        : () => true;
    const dataList = await this.messageWrapper.query(
      condition,
      DB_CONFIG.RECORD_STORE_NAME,
      {
        field: 'timestamp',
        direction: 'asc',
      }
    );
    return dataList.map((item) => JSON.stringify(item));
  }

  async collectError(error: ExtendedError | string) {
    let errorInfo;
    if (error instanceof Error) {
      errorInfo = {
        errorType: error.name,
        errorMessage: error.message,
        stackTrace: error.stack,
        cause: error.cause || '',
        timestamp: formatDate(new Date()),
        userAgent: navigator.userAgent,
        url: normalizeUrlForPath(window.location.href),
        operationSequence: this.operationSequence.slice(),
        logContext: this.logContext,
      };
    } else if (typeof error === 'string') {
      // 对于字符串类型的错误，我们假设它是网络错误或其他非 JavaScript 错误
      errorInfo = {
        errorType: 'Non-JavaScript Error',
        errorMessage: error.message,
        timestamp: formatDate(new Date()),
        userAgent: navigator.userAgent,
        url: normalizeUrlForPath(window.location.href),
        operationSequence: this.operationSequence.slice(),
        logContext: this.logContext,
      };
    } else {
      errorInfo = {
        errorType: 'Unexpected Error',
        errorMessage: error.message,
        timestamp: formatDate(new Date()),
        userAgent: navigator.userAgent,
        url: normalizeUrlForPath(window.location.href),
        operationSequence: this.operationSequence.slice(),
        logContext: this.logContext,
      };
    }

    try {
      const startTime = new Date().getTime() - 100000;
      const endTime = new Date().getTime() + 100000;
      errorInfo.record = await this.getRange(startTime, endTime);
      console.log(errorInfo.record);
    } catch (screenshotError) {
      console.error('Error capturing screenshot:', screenshotError);
    }

    return errorInfo;
  }
}
