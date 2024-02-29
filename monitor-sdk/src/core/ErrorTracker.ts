import { normalizeUrlForPath, formatDate,getCurrentUnix } from '../utils';
import MessageQueueDBWrapper from './Message';
import { DB_CONFIG } from '../config/dbconfig';
import HttpError from '../model/HttpError';
interface ErrorInfo {
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  cause?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  operationSequence: any[];
  logContext: any;
  method?: string;
  requestUrl?: string;
  data?: any;
  status?: number;
  record?: any; // 根据实际情况定义record的类型
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

  async collectError(error: Error | string | HttpError) {
    let errorInfo = this.getCommonErrorInfo(error);
    if (error instanceof HttpError) {
      errorInfo.errorType = 'XHR ERROR';
      errorInfo.method = error.method;
      errorInfo.requestUrl = error.requestUrl;
      errorInfo.data = error.data;
      errorInfo.status = error.status;
    }

    try {
      const startTime = getCurrentUnix() - 120000;
      const endTime = getCurrentUnix() + 300000;
      errorInfo.record = await this.getRange(startTime, endTime);
    } catch (screenshotError) {
    }

    return errorInfo as ErrorInfo; // 如果ErrorInfo是一个接口或类型，请确保它包含了所有可能的属性
  }

  private getCommonErrorInfo(error: Error | string): Partial<ErrorInfo> {
    return {
      errorType: (error instanceof Error) ? error.name : 'Non-JavaScript Error',
      errorMessage: (error instanceof Error) ? error.message : error,
      stackTrace: (error instanceof Error) ? error.stack : undefined,
      cause: (error instanceof Error && error.cause) as string || '',
      timestamp: formatDate(new Date()),
      userAgent: navigator.userAgent,
      url: normalizeUrlForPath(window.location.href),
      operationSequence: this.operationSequence.slice(),
      logContext: this.logContext,
    };
  }
}
