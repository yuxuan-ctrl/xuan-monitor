package com.xuan.task;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.mapper.MetricsMapper;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.service.ESDocumentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TrafficAnalyticsAggregationTask {

    @Autowired
    private ESDocumentService esDocumentService;

    @Autowired
    private MetricsMapper metricsMapper;


    public void aggregateYesterdayData() throws IOException {
        esDocumentService.ensureIndexExists("events", "actions");
        List<EventList> eventList = esDocumentService.queryPastHours("events", "timestamp", EventList.class,new MetricsDTO());
        if(!eventList.isEmpty()){
            LocalDate date = LocalDate.ofInstant(eventList.get(eventList.size()-1).getTimestamp().toInstant(), ZoneId.systemDefault()).minusDays(1); // 假设timestamp是前一天的
            Metrics metrics = CalculateUtil.calculateMetrics(eventList);
            metrics.setDate(DateFormatUtils.format(date.atStartOfDay()));
            metricsMapper.insert(metrics);
        }
    }

}
