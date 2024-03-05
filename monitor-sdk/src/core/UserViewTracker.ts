import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Monitor from './Monitor';
import { getCurrentUnix } from '../utils';
interface UVData {
  uniqueKey: string;
  timestamp: number;
  userAgent?: string;
  language?: string;
  timeZoneOffset?: number;
  // 添加更多可能感兴趣的用户信息字段
}

export default class UvTracker {
  public uvData: UVData | null = null;
  public customKey?: string;
  public refreshIntervalId?: number;
  monitor: Monitor;
  uniqueKey: string;

  constructor(customKey?: string, monitor?: Monitor) {
    this.customKey = customKey;
    this.monitor = monitor;
    this.getUniqueKey().then((res) => {
      this.uniqueKey = res;
    });
  }

  /**
   * 获取或生成唯一的用户标识符（unique key）。
   *
   * @returns 返回唯一用户标识符。
   */
  async getUniqueKey(): Promise<string> {
    if (this.customKey) {
      return this.customKey;
    }

    // 如果没有自定义键，使用FingerprintJS生成设备指纹
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    // 使用FingerprintJS生成的组件哈希作为唯一键
    const uniqueKey = result.visitorId;

    return uniqueKey;
  }

  /**
   * 收集用户的附加信息。
   *
   * @returns 返回包含附加用户信息的对象。
   */
  collectUserInfo(): Partial<UVData> {
    const userInfo: Partial<UVData> = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timeZoneOffset: new Date().getTimezoneOffset(),
    };

    return userInfo;
  }

  /**
   * 记录UV数据。
   *
   * @param customKey 可选的自定义唯一键。
   */
  async trackUv(customKey?: string): Promise<UVData> {
    if (customKey) {
      this.customKey = customKey;
    }

    const uniqueKey = await this.getUniqueKey();
    const userInfo = this.collectUserInfo();

    // 存储UV数据
    this.uvData = {
      uniqueKey,
      timestamp: getCurrentUnix(),
      ...userInfo,
    };

    return this.uvData;
  }

  /**
   * 初始化定期刷新UV数据的定时器。
   */
  initRefreshInterval(sendMessage: Function) {
    const refreshIntervalInHours = 1; // 设置为每小时刷新一次

    this.refreshIntervalId = window.setInterval(
      async () => {
        await this.trackUv();
        sendMessage.call(this.monitor);
      },
      refreshIntervalInHours * 60 * 60 * 1000
    );
  }

  /**
   * 停止定期刷新UV数据的定时器。
   */
  stopRefreshInterval() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = undefined;
    }
  }
}
