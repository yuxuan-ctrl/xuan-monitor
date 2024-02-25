package com.xuan.dao.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetricsDTO {
    private Instant startTime;
    private Instant endTime;
    private String appId;
    private String userId;

    public Instant getStartTimeOrDefault(Instant defaultValue) {
        return startTime != null ? startTime : defaultValue;
    }

    public Instant getEndTimeOrDefault(Instant defaultValue) {
        return endTime != null ? endTime : defaultValue;
    }

    public String getAppIdOrDefault() {
        return appId != null ? appId : null;
    }

    public String getUserIdOrDefault() {
        return userId != null ? userId : null;
    }
}
