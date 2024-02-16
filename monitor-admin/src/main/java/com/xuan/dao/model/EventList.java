package com.xuan.dao.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventList {

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
    private Timestamp timestamp;;

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
}
