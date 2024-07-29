package com.xuan.service.impl.clickhouse;


import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.mapper.clickhouse.ActionsMapper;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.mapper.clickhouse.InterfaceCkMapper;
import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import com.xuan.service.MonitoringDataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class MonitoringDataStorageServiceCkImpl implements MonitoringDataStorageService {

    @Autowired
    public EventsMapper eventsMapper;

    @Autowired
    public ActionsMapper actionsMapper;

    @Autowired
    public InterfaceCkMapper interfaceCkMapper;

    @Override
    public void recordMonitoringData(String appId, String userId, List<ActionInfo> actionDataList, List<EventInfo> eventDataList, List<InterfaceInfo> interfaceDataList) throws IOException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 使用此格式器来格式化当前时间
        String createTime = LocalDateTime.now().format(formatter);

        eventDataList.forEach(event -> {
            String eventId = UUID.randomUUID().toString();
            EventInfo eventInfo = EventInfo.builder()
                    .createTime(DateFormatUtils.format(LocalDateTime.now()))
                    .id(eventId)
                    .appId(appId)
                    .userId(userId)
                    .metrics(event.getMetrics())
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

        actionDataList.forEach(action -> {
            String actionId = UUID.randomUUID().toString();
            ActionInfo actionInfo = ActionInfo.builder()
                    .id(actionId)
                    .createTime(createTime)
                    .appId(appId)
                    .userId(userId)
                    .type(action.getType())
                    .timestamp(action.getTimestamp())
                    .data(action.getData())
                    .build();

            actionsMapper.insert(actionInfo);
        });

        interfaceDataList.forEach(interfaceInfo -> {
            String interfaceId = UUID.randomUUID().toString();
            InterfaceInfo interfaceEntity = InterfaceInfo.builder()
                    .id(interfaceId)
                    .createTime(createTime)
                    .appId(appId)
                    .requestUrl(interfaceInfo.getRequestUrl())
                    .duration(interfaceInfo.getDuration())
                    .method(interfaceInfo.getMethod())
                    .pageUrl(interfaceInfo.getPageUrl())
                    .timestamp(interfaceInfo.getTimestamp())
                    .userId(userId)
                    .build();

            interfaceCkMapper.insert(interfaceEntity);
        });
    }
}
