package com.xuan.service.impl.clickhouse;

import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.mapper.postgres.MetricsMapper;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.service.ClickHouseService;
import com.xuan.service.DataAggregationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class DataAggregationServiceCkImpl implements DataAggregationService {

    @Autowired
    private MetricsMapper metricsMapper;
    @Autowired
    public EventsMapper eventsMapper;

    @Autowired
    public ClickHouseService clickHouseService;

    @Override
    public void processAndAggregateYesterdayData() throws IOException {
        MetricsDTO metricsDTO = new MetricsDTO();
        Metrics metrics = clickHouseService.aggregateData(metricsDTO);
        metricsMapper.insert(metrics);
    }
}
