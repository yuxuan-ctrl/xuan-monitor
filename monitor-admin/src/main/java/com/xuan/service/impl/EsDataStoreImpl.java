package com.xuan.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.alibaba.fastjson.JSON;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.dao.mapper.ErrorMapper;
import com.xuan.dao.mapper.MetricsMapper;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.EsDataStore;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EsDataStoreImpl implements EsDataStore {
    @Autowired
    private CalculateUtil calculateUtil;

    @Autowired
    public ErrorMapper errorMapper;

    @Autowired
    private ESDocumentService esDocumentService;

    @Autowired
    private ElasticsearchClient client;
    @Autowired
    private MetricsMapper metricsMapper;

    @Override
    public void aggregateYesterdayData() throws IOException {
        esDocumentService.ensureIndexExists("events", "actions");
        List<EventList> eventList = esDocumentService.queryPastHours("events", "timestamp", EventList.class,new MetricsDTO());
        if(!eventList.isEmpty()){
            Metrics metrics = calculateUtil.calculateMetrics(eventList);
            metricsMapper.insert(metrics);
        }
    }

    @Override
    public void recordMonitorInfo(String appId, String userId,List<Map<String, Object>>  actionList, List<Map<String, Object>> eventList) throws IOException {
        esDocumentService.ensureIndexExists("events", "actions"); // 一次性检查两个索引

        Map dataMap = new HashMap();
        dataMap.put("events",eventList);
        dataMap.put("actions",actionList);

        processAndSaveData(appId,userId, dataMap, Arrays.asList("events", "actions")); // 合并事件和操作列表处理，并一次性保存到两个索引
    }

    @Override
    public Void errorHandler(ErrorInfoDto errorInfoDto) throws Exception {
        BooleanResponse exists = client.indices().exists(e -> e.index("errors"));
        if (!exists.value()) {
            client.indices().create(c -> c.index("errors"));
        }else{
            errorInfoDto.setCreateTime(LocalDateTime.now().toString());
            IndexResponse response = esDocumentService.createByJson("errors", UUID.randomUUID().toString(), JSON.toJSONString(errorInfoDto));
            System.out.println("response.toString() -> " + response.toString());
            Errors errors = new Errors();
            BeanUtils.copyProperties(errorInfoDto,errors);
            errors.setEsErrorId(response.id());
            errorMapper.insert(errors);
        }
        return null;
    }

    @Override
    public MetricsVo getMetrics(String appId, Instant startTime, Instant endTime, String userId) {
        return null;
    }

    @Override
    public List<MetricsVo> getChartsData(String appId, Instant startTime, Instant endTime) {
        return null;
    }

    @Override
    public AppsDashboardVo getAppsDashboardData(String userId) {
        return null;
    }

    @Override
    public ErrorInfoDto getErrorsDetails(String id) {
        return null;
    }

    private void processAndSaveData(String appId, String userId,Map<String,List> dataMap, List<String> indexNames) {
        for (String indexName : indexNames) {
            List<? extends Map<String, Object>> dataList = dataMap.get(indexName);
            dataList.forEach(data -> {
                data.put("createTime", LocalDateTime.now());
                data.put("appId", appId);
                data.put("userId", userId);
                try {
                    IndexResponse response = esDocumentService.createByJson(indexName, UUID.randomUUID().toString(), JSON.toJSONString(data));
                    System.out.printf("reponse->",response);
                    // 可能需要对响应进行处理或记录错误
                } catch (Exception e) {
                    throw new RuntimeException("Failed to save data to index '" + indexName + "'", e);
                }
            });
        }
    }
}
