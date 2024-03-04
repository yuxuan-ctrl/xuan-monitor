package com.xuan.dao.model;

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
public class  EventInfo {

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
    private Map<String, Integer> screenResolution;

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
    private int stayDuration;

    private LocalDateTime createTime;

    private Map<String, Object> metrics;

    private Map<String, List<Map<String, Object>>> slowResources;

}
