/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-05 14:03:01
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-06 17:56:00
 * @FilePath: \xuan-monitor\monitor-service\src\main\java\com\xuan\service\impl\MonitorServiceImpl.java
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
package com.xuan.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.properties.JwtProperties;
import com.xuan.dao.mapper.ErrorMapper;
import com.xuan.dao.mapper.WebpvuvMapper;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.dto.EventsDto;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Webpvuv;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.MonitorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Service
@Slf4j
public class MonitorServiceImpl extends ServiceImpl<WebpvuvMapper, Webpvuv> implements MonitorService {

    @Autowired
    public WebpvuvMapper webpvuvMapper;

    @Autowired
    public JwtProperties jwtProperties;

    @Autowired
    public ErrorMapper errorMapper;



    @Autowired
    private ElasticsearchClient client;
    private final ESDocumentService documentDemoService;

    public MonitorServiceImpl(ESDocumentService documentDemoService) {
        this.documentDemoService = documentDemoService;
    }


    @Override
    public ReportVo recordMonitorInfo(EventsDto eventsDto) throws IOException {
//        String appId = eventsDto.getAppId();
//        List<EventList> eventList = eventsDto.getEventList();
//        List<Map<String, Object>> actionList = eventsDto.getActionList();
//        BooleanResponse exists = client.indices().exists(e -> e.index("events"));
//        BooleanResponse actionsExists = client.indices().exists(e -> e.index("actions"));
//
//        if (!exists.value()) {
//            client.indices().create(c -> c.index("events"));
//        }else{
//            eventList.stream().forEach(event->{
//                event.setAppId(appId);
//                IndexResponse response = null;
//                try {
//                    response = documentDemoService.createByJson("events", UUID.randomUUID().toString(), JSON.toJSONString(event));
//                } catch (Exception e) {
//                    throw new RuntimeException(e);
//                }
//            });
//
//        }
//        if (!actionsExists.value()) {
//            client.indices().create(c -> c.index("actions"));
//        }else{
//            actionList.stream().forEach(action->{
//                IndexResponse response = null;
//                try {
//                    response = documentDemoService.createByJson("actions", UUID.randomUUID().toString(), JSON.toJSONString(action));
//                } catch (Exception e) {
//                    throw new RuntimeException(e);
//                }
//            });
//
//        }
//        return  null;
        String appId = eventsDto.getAppId();
        List<Map<String, Object>> eventList = eventsDto.getEventList();
        List<Map<String, Object>> actionList = eventsDto.getActionList();

        // 检查并创建索引（可优化为单个请求检查多个索引）
        ensureIndexExists("events", "actions");

        // 优化事件列表处理
        processAndSaveData(appId, (List<? extends Map<String, Object>>) eventList, "events");

        // 添加应用ID到操作列表，并保存数据
        List<Map<String, Object>> actionsWithAppId = actionList.stream()
                .peek(action -> action.put("appId", appId))
                .collect(Collectors.toList());
        processAndSaveData(appId, actionsWithAppId, "actions");

        return null; // 返回值根据实际业务需求填充
    }

    private void ensureIndexExists(String... indices) throws IOException {
        for (String index : indices) {
            if (!client.indices().exists(e -> e.index(index)).value()) {
                client.indices().create(c -> c.index(index));
            }
        }
    }

    private void processAndSaveData(String appId, List<? extends Map<String, Object>> dataList, String indexName) {
        dataList.forEach(data -> {
            try {
                IndexResponse response = documentDemoService.createByJson(indexName, UUID.randomUUID().toString(), JSON.toJSONString(data));
                // 可能需要对响应进行处理或记录错误
            } catch (Exception e) {
                throw new RuntimeException("Failed to save data to index '" + indexName + "'", e);
            }
        });
    }

    @Override
    public Void errorHandler(ErrorInfoDto errorInfoDto) throws Exception {
        BooleanResponse exists = client.indices().exists(e -> e.index("errors"));

        if (!exists.value()) {
            client.indices().create(c -> c.index("errors"));
        }else{
            IndexResponse response = documentDemoService.createByJson("errors", UUID.randomUUID().toString(), JSON.toJSONString(errorInfoDto));
            System.out.println("response.toString() -> " + response.toString());
            Errors errors = new Errors();
            BeanUtils.copyProperties(errorInfoDto,errors);
            errors.setEsErrorId(response.id());
            errorMapper.insert(errors);
        }
        return null;
    }
}
