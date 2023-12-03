package com.xuan.dao.pojo.dto;

public class EventList {
    public  String type;
    public  String uuid;
    public  String pageUrl;
    public  Integer timestamp;
    public  Object errorInfo;
    public  Performance data;

    public EventList() {
    }

    public EventList(String type, String uuid, String pageUrl, Integer timestamp, Object errorInfo, Performance data) {
        this.type = type;
        this.uuid = uuid;
        this.pageUrl = pageUrl;
        this.timestamp = timestamp;
        this.errorInfo = errorInfo;
        this.data = data;
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
     * @return uuid
     */
    public String getUuid() {
        return uuid;
    }

    /**
     * 设置
     * @param uuid
     */
    public void setUuid(String uuid) {
        this.uuid = uuid;
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
     * @return timestamp
     */
    public Integer getTimestamp() {
        return timestamp;
    }

    /**
     * 设置
     * @param timestamp
     */
    public void setTimestamp(Integer timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * 获取
     * @return errorInfo
     */
    public Object getErrorInfo() {
        return errorInfo;
    }

    /**
     * 设置
     * @param errorInfo
     */
    public void setErrorInfo(Object errorInfo) {
        this.errorInfo = errorInfo;
    }

    /**
     * 获取
     * @return data
     */
    public Performance getData() {
        return data;
    }

    /**
     * 设置
     * @param data
     */
    public void setData(Performance data) {
        this.data = data;
    }

    public String toString() {
        return "EventList{type = " + type + ", uuid = " + uuid + ", pageUrl = " + pageUrl + ", timestamp = " + timestamp + ", errorInfo = " + errorInfo + ", data = " + data + "}";
    }
}
