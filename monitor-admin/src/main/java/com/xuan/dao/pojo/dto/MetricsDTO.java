package com.xuan.dao.pojo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetricsDTO {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Instant startTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Instant endTime;
    private String appId;
    private String userId;

    public Instant getStartTimeOrDefault(Instant defaultValue) {
        return startTime != null ? startTime : defaultValue.plusMillis(TimeUnit.HOURS.toMillis(8));
    }

    public Instant getEndTimeOrDefault(Instant defaultValue) {
        return endTime != null ? endTime : defaultValue.plusMillis(TimeUnit.HOURS.toMillis(8));
    }

    public String getAppIdOrDefault() {
        return appId != null ? appId : null;
    }

    public String getUserIdOrDefault() {
        return userId != null ? userId : null;
    }
}
