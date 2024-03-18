package com.xuan.dao.pojo.entity.clickhouse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionInfo implements BaseInfo{

    @JsonProperty("id")
    String id;

    @JsonProperty("appId")
    String appId;

    @JsonProperty("userId")
    String userId;

    @JsonProperty("type")
    private String type;

    @JsonProperty("data")
    private String data;

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("createTime")
    private String createTime;

    private String pageUrl;
}
