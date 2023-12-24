package com.xuan.dao.pojo.vo;

public class ReportVo {

    String appId;
    String pageUrl;
    String time;
    Object data;

    public ReportVo() {
    }

    public ReportVo(String appId, String pageUrl, String time, Object data) {
        this.appId = appId;
        this.pageUrl = pageUrl;
        this.time = time;
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
        return "ReportVo{appId = " + appId + ", pageUrl = " + pageUrl + ", time = " + time + ", data = " + data + "}";
    }
}
