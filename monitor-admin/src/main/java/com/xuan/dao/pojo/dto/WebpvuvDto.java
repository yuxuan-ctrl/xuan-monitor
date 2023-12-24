package com.xuan.dao.pojo.dto;

import java.util.List;

public class WebpvuvDto {
    String appId;
    String pageUrl;
    String time;

    List<EventList> eventList;

    public WebpvuvDto() {
    }

    public WebpvuvDto(String appId, String pageUrl, String time, List<EventList> eventList) {
        this.appId = appId;
        this.pageUrl = pageUrl;
        this.time = time;
        this.eventList = eventList;
    }

    /**
     * 获取
     * @return appId
     */
    public String getAppId() {
        return appId;
    }

    /**
     * 设置
     * @param appId
     */
    public void setAppId(String appId) {
        this.appId = appId;
    }

    /**
     * 获取
     * @return pageUrl
     */
    public String getPageUrl() {
        return pageUrl;
    }

    /**
     * 设置
     * @param pageUrl
     */
    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    /**
     * 获取
     * @return time
     */
    public String getTime() {
        return time;
    }

    /**
     * 设置
     * @param time
     */
    public void setTime(String time) {
        this.time = time;
    }




    /**
     * 获取
     * @return eventList
     */
    public List<EventList> getEventList() {
        return eventList;
    }

    /**
     * 设置
     * @param eventList
     */
    public void setEventList(List<EventList> eventList) {
        this.eventList = eventList;
    }

    public String toString() {
        return "WebpvuvDto{appId = " + appId + ", pageUrl = " + pageUrl + ", time = " + time + ", eventList = " + eventList + "}";
    }
}
