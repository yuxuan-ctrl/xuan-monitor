package com.xuan.dao.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageViewInfo {
    private String pageUrl;
    private long viewCount;
    private double totalStayDuration;
    private double averageStayDuration;

    public PageViewInfo(String pageUrl, Long viewCount) {
        this.pageUrl = pageUrl;
        this.viewCount = viewCount;
    }

    public PageViewInfo(String pageUrl,double totalStayDuration,long viewCount) {
        this.pageUrl = pageUrl;
        this.totalStayDuration = totalStayDuration;
    }

    public void merge(String pageUrl, double stayDuration) {
        if (this.pageUrl == null) {
            this.pageUrl = pageUrl;
        }
        this.totalStayDuration += stayDuration;
        this.viewCount++;
    }



}
