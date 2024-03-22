package com.xuan.dao.pojo.entity.clickhouse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterfaceInfo {
    @JsonProperty("id")
    String id;

    @JsonProperty("appId")
    String appId;

    @JsonProperty("userId")
    String userId;

    @JsonProperty("method")
    private String method;

    @JsonProperty("createTime")
    private String createTime;

    @JsonProperty("requestUrl")
    private String requestUrl;

    @JsonProperty("pageUrl")
    private String pageUrl;

    @JsonProperty("timestamp")
    private Long timestamp;

    @JsonProperty("duration")
    private Float duration;

}
