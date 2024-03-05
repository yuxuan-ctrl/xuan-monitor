package com.xuan.service.impl.elasticsearch;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.alibaba.fastjson.JSON;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.MonitoringDataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "elasticsearch")
public class MonitoringDataStorageServiceEsImpl implements MonitoringDataStorageService {

    @Autowired
    private ESDocumentService esDocumentService;

    @Override
    public void recordMonitoringData(String appId, String userId, List<Map<String, Object>> actionDataList, List<EventInfo> eventDataList) throws IOException {
        esDocumentService.ensureIndexExists("events", "actions");

        for (EventInfo eventInfo : eventDataList) {
            eventInfo.setCreateTime(DateFormatUtils.format(LocalDateTime.now()));
            eventInfo.setAppId(appId);
            eventInfo.setUserId(userId);

            try {
                IndexResponse response = esDocumentService.createByJson(
                        "events",
                        UUID.randomUUID().toString(),
                        JSON.toJSONString(eventInfo));
                System.out.printf("response-> %s%n", response);
                // 可能需要对响应进行处理或记录错误
            } catch (Exception e) {
                throw new RuntimeException("Failed to save event data to index 'events'", e);
            }
        }

        // 对于 actionsList，由于仍是 Map 类型，保持不变
        for (Map<String, Object> actionData : actionDataList) {
            actionData.put("createTime", LocalDateTime.now());
            actionData.put("appId", appId);
            actionData.put("userId", userId);

            try {
                IndexResponse response = esDocumentService.createByJson(
                        "actions",
                        UUID.randomUUID().toString(),
                        JSON.toJSONString(actionData));
                System.out.printf("response-> %s%n", response);
                // 可能需要对响应进行处理或记录错误
            } catch (Exception e) {
                throw new RuntimeException("Failed to save action data to index 'actions'", e);
            }
        }
    }

}
