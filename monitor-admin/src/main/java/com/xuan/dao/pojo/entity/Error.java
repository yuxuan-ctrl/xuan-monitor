package com.xuan.dao.pojo.entity;

public class Error {
    public String errorMessage;
    public String errFileName;
    public String pageUrl;
    public String time;

    public Error() {
    }

    public Error(String errorMessage, String errFileName, String pageUrl, String time) {
        this.errorMessage = errorMessage;
        this.errFileName = errFileName;
        this.pageUrl = pageUrl;
        this.time = time;
    }

    /**
     * 获取
     * @return errorMessage
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * 设置
     * @param errorMessage
     */
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    /**
     * 获取
     * @return errFileName
     */
    public String getErrFileName() {
        return errFileName;
    }

    /**
     * 设置
     * @param errFileName
     */
    public void setErrFileName(String errFileName) {
        this.errFileName = errFileName;
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

    public String toString() {
        return "Error{errorMessage = " + errorMessage + ", errFileName = " + errFileName + ", pageUrl = " + pageUrl + ", time = " + time + "}";
    }
}
