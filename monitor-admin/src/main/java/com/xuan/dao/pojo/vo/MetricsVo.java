package com.xuan.dao.pojo.vo;

import com.xuan.dao.pojo.entity.Metrics;
import lombok.Data;

@Data
public class MetricsVo extends Metrics {
    private long uniqueVisitorGrowthCount;
    private long pageViewGrowthCount;
}
