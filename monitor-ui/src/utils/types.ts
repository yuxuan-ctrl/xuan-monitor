export interface SDKConfigType {
    appId: string
    baseUrl: string
    onPageShow: Function
    onPagesHide: Function
}

export interface BaseEventType {
    /**触发事件的时间戳 */
    timestamp: number
    /**事件uuid */
    uuid: string
    /**页面url */
    pageUrl: string
    /**事件类型 */
    type: string
}

export interface PerformanceType {
    dnst: number
    tcpt: number
    wit: number
    domt: number
    lodt: number
    radt: number
    rdit: number
    uodt: number
    reqt: number
    andt: number
}

export interface QueueEventType extends BaseEventType, AnyObject {}

export type AnyObject = { [key: string | number | symbol]: any }
