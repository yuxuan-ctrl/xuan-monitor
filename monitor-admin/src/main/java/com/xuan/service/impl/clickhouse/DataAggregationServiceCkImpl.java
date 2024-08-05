package com.xuan.service.impl.clickhouse;

import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.mapper.postgres.MetricsMapper;
import com.xuan.dao.model.UserAction;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.dto.UserDetailsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.service.ClickHouseService;
import com.xuan.service.DataAggregationService;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

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
    public void processAndAggregateYesterdayData(String appId) throws IOException {
        MetricsDTO metricsDTO = new MetricsDTO(null,null,appId,null);
        Metrics metrics = clickHouseService.aggregateData(metricsDTO);
        if(ObjectUtils.isNotEmpty(metrics)){
            metricsMapper.insert(metrics);
        }
    }

}
