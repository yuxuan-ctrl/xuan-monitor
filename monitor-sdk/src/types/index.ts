export interface SDKConfigType {
  appId: string;
  time?: number;
  baseUrl: string;
  onPageShow?: Function;
  onPagesHide?: Function;
}

export interface BaseEventType {
  /**触发事件的时间戳 */
  timestamp: number;
  /**事件uuid */
  uuid: string;
  /**页面url */
  pageUrl: string;
  /**事件类型 */
  type: string;
}

export interface PerformanceType {
  dnst: number;
  tcpt: number;
  wit: number;
  domt: number;
  lodt: number;
  radt: number;
  rdit: number;
  uodt: number;
  reqt: number;
  andt: number;
}

export interface QueueEventType extends BaseEventType, AnyObject {}
export interface EventConfig {
  type?: "single" | "mutiple";
}

export type AnyObject = { [key: string | number | symbol]: any };

export interface PageViewData {
  id?: number; // 数据库自动生成的 ID
  timestamp: number; // 页面访问时间戳
  pagePath: string; // 页面路径
  userId: string; // 用户标识（可以是用户 ID、Session ID 等）
  appId: string; // 用户标识（可以是用户 ID、Session ID 等）
  ipAddress: string; // 用户的 IP 地址
  userAgent: string; // 用户的 User Agent 信息
  duration: number; // 用户停留时长（毫秒）
  referrer?: string; // 来源页面
  browser: string; // 用户使用的浏览器
  os: string; // 用户使用的操作系统
  pageShowTime: number;
}
