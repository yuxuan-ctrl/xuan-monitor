package com.xuan.service.impl.elasticsearch;

import com.xuan.common.utils.CalculateUtil;
import com.xuan.dao.mapper.postgres.MetricsMapper;
import com.xuan.dao.model.EventInfo;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.service.DataAggregationService;
import com.xuan.service.ESDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "elasticsearch")
public class DataAggregationServiceEsImpl implements DataAggregationService {
    @Autowired
    private CalculateUtil calculateUtil;
    @Autowired
    private ESDocumentService esDocumentService;

    @Autowired
    private MetricsMapper metricsMapper;

    @Override
    public void processAndAggregateYesterdayData() throws IOException {
        esDocumentService.ensureIndexExists("events", "actions");
        List<EventInfo> eventList = esDocumentService.queryPastHours("events", "timestamp", EventInfo.class,new MetricsDTO());
        if(!eventList.isEmpty()){
            Metrics metrics = calculateUtil.calculateMetrics(eventList);
            metricsMapper.insert(metrics);
        }
    }
}
