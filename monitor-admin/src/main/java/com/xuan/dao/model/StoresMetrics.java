package com.xuan.dao.model;

import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StoresMetrics {
    Metrics aggregatedMetrics;

    List<EventInfo> todayEventList;
}
