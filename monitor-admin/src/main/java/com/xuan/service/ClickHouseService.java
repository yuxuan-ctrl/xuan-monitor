package com.xuan.service;

import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;

import java.io.IOException;

public interface ClickHouseService {
    Metrics aggregateData(MetricsDTO metricsDTO) throws IOException;
}
