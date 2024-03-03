package com.xuan.dao.model;

import com.xuan.dao.pojo.entity.Metrics;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StoresMetrics {
    Metrics aggregatedMetrics;

    List<EventList> todayEventList;
}
