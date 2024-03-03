package com.xuan.service.impl.clickhouse;

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
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class MonitoringDataStorageServiceCkImpl implements MonitoringDataStorageService {


    @Override
    public void recordMonitoringData(String appId, String userId, List<Map<String, Object>> actionDataList, List<Map<String, Object>> eventDataList) throws IOException {
    }
}
