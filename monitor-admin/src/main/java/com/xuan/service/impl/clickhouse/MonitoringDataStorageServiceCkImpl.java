package com.xuan.service.impl.clickhouse;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.alibaba.fastjson.JSON;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.model.EventInfo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.MonitoringDataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class MonitoringDataStorageServiceCkImpl implements MonitoringDataStorageService {

    @Autowired
    public EventsMapper eventsMapper;

    @Override
    public void recordMonitoringData(String appId, String userId, List<Map<String, Object>> actionDataList, List<Map<String, Object>> eventDataList) throws IOException {
        eventDataList.forEach(event -> {
            EventInfo eventInfo = EventInfo.builder()
                    .createTime(LocalDateTime.now())
                    .appId(appId)
                    .userId(userId)
                    .metrics((Map<String, Object>) event.get("metrics"))
                    .language((String) event.get("language"))
                    .pageUrl((String) event.get("pageUrl"))
                    .platform((String) event.get("platform"))
                    .referrer((String) event.get("referrer"))
                    .stayDuration((int) event.get("stayDuration"))
                    .slowResources((Map<String, List<Map<String, Object>>>) event.get("slowResources"))
                    .screenResolution((Map<String, Integer>) event.get("screenResolution"))
                    .uniqueKey((String) event.get("uniqueKey"))
                    .timestamp((Long) event.get("timestamp"))
                    .userAgent((String) event.get("userAgent"))
                    .build();
            eventsMapper.insert(eventInfo);
        });
    }
}
