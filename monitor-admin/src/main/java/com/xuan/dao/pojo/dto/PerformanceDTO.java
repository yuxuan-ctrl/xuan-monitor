package com.xuan.dao.pojo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xuan.dao.model.Location;
import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceDTO implements Serializable {
    @JsonProperty("appId")
    String appId;
    private int pageSize;
    private int pageIndex;
    @JsonProperty("userId")
    String userId;
    String method;
    String status;
    String startTime;
    String endTime;

    @JsonProperty("timeStep")
    String timeStep;

    String requestUrl;
}
