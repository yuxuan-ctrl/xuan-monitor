package com.xuan.service.impl.elasticsearch;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.alibaba.fastjson.JSON;
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
    public void recordMonitoringData(String appId, String userId, List<Map<String, Object>> actionDataList, List<Map<String, Object>> eventDataList) throws IOException {
        esDocumentService.ensureIndexExists("events", "actions"); // 一次性检查两个索引

        Map<String, List> dataMap = new HashMap();
        dataMap.put("events", eventDataList);
        dataMap.put("actions", actionDataList);

        for (String indexName : Arrays.asList("events", "actions")) {
            List<? extends Map<String, Object>> dataList = dataMap.get(indexName);
            dataList.forEach(data -> {
                data.put("createTime", LocalDateTime.now());
                data.put("appId", appId);
                data.put("userId", userId);
                try {
                    IndexResponse response = esDocumentService.createByJson(indexName, UUID.randomUUID().toString(), JSON.toJSONString(data));
                    System.out.printf("reponse->", response);
                    // 可能需要对响应进行处理或记录错误
                } catch (Exception e) {
                    throw new RuntimeException("Failed to save data to index '" + indexName + "'", e);
                }
            });
        }
    }
}
