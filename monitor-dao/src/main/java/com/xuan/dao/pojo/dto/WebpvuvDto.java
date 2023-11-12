package com.xuan.dao.pojo.dto;

public class WebpvuvDto {
    String appId;
    String pageUrl;
    String time;
    String type;
    Object data;

    public WebpvuvDto() {
    }

    public WebpvuvDto(String appId, String pageUrl, String time, String type, Object data) {
        this.appId = appId;
        this.pageUrl = pageUrl;
        this.time = time;
        this.type = type;
        this.data = data;
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
     * @return type
     */
    public String getType() {
        return type;
    }

    /**
     * 设置
     * @param type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取
     * @return data
     */
    public Object getData() {
        return data;
    }

    /**
     * 设置
     * @param data
     */
    public void setData(Object data) {
        this.data = data;
    }

    public String toString() {
        return "WebpvuvDto{appId = " + appId + ", pageUrl = " + pageUrl + ", time = " + time + ", type = " + type + ", data = " + data + "}";
    }
}
