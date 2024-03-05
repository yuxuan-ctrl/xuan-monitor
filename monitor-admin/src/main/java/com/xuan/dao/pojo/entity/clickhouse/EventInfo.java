package com.xuan.dao.pojo.entity.clickhouse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventInfo {

    @JsonProperty("appId")
    String appId;

    @JsonProperty("mostVisitedPageId")
    private String mostVisitedPageId;

    @JsonProperty("mostVisitedPageViews")
    private int mostVisitedPageViews;

    @JsonProperty("pageUrl")
    private String pageUrl;

    @JsonProperty("userAgent")
    private String userAgent;

    @JsonProperty("platform")
    private String platform;

    @JsonProperty("screenResolution")
    private String screenResolution;

    @JsonProperty("timestamp")
    private Long timestamp;

    @JsonProperty("referrer")
    private String referrer;

    @JsonProperty("uniqueKey")
    private String uniqueKey;

    @JsonProperty("language")
    private String language;

    @JsonProperty("timeZoneOffset")
    private int timeZoneOffset;

    @JsonProperty("name")
    private String name;

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("stayDuration")
    private double stayDuration;

    private String createTime;

    private String metrics;

    private String slowResources;

}
