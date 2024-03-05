package com.xuan.service.impl.clickhouse;


import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.service.MonitoringDataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class MonitoringDataStorageServiceCkImpl implements MonitoringDataStorageService {

    @Autowired
    public EventsMapper eventsMapper;

    @Override
    public void recordMonitoringData(String appId, String userId, List<Map<String, Object>> actionDataList, List<EventInfo> eventDataList) throws IOException {
        eventDataList.forEach(event -> {
            EventInfo eventInfo = EventInfo.builder()
                    .createTime(DateFormatUtils.format(LocalDateTime.now()))
                    .appId(appId)
                    .userId(userId)
                    .metrics( event.getMetrics())
                    .language(event.getLanguage())
                    .pageUrl(event.getPageUrl())
                    .platform(event.getPlatform())
                    .referrer(event.getReferrer())
                    .stayDuration(event.getStayDuration())
                    .slowResources(event.getSlowResources())
                    .screenResolution(event.getScreenResolution())
                    .uniqueKey(event.getUniqueKey())
                    .timestamp(event.getTimestamp())
                    .userAgent(event.getUserAgent())
                    .build();

            eventsMapper.insert(eventInfo);
        });

    }
}
