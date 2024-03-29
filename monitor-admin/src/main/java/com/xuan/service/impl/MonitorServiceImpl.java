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
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.properties.JwtProperties;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.dao.mapper.*;
import com.xuan.dao.model.Location;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.entity.*;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.MonitorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.json.Json;
import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
public class MonitorServiceImpl extends ServiceImpl<MetricsMapper, Metrics> implements MonitorService {

    @Autowired
    public MetricsMapper metricsMapper;

    @Autowired
    public UserMapper userMapper;

    @Autowired
    public JwtProperties jwtProperties;

    @Autowired
    public ErrorMapper errorMapper;

    @Autowired
    public SystemsMapper systemsMapper;

    @Autowired
    private ElasticsearchClient client;
    private final ESDocumentService elasticService;

    public MonitorServiceImpl(ESDocumentService elasticService) {
        this.elasticService = elasticService;
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public ReportVo recordMonitorInfo(EventsDTO eventsDto, HttpServletRequest httpRequest) throws IOException {
        String appId = eventsDto.getAppId();
        String userId = eventsDto.getUserId();
        String platform = eventsDto.getPlatform();
        String userAgent = eventsDto.getUserAgent();
        String ipAddress = CalculateUtil.getIpAddress(httpRequest);
        Location location = eventsDto.getLocation();
        List<Map<String, Object>> actionList = eventsDto.getActionList();
        List<Map<String, Object>> eventList = eventsDto.getEventList();

        if(!systemsMapper.exists(new LambdaQueryWrapper<Systems>().eq(Systems::getAppId,appId))){
            systemsMapper.insert(Systems.builder()
                    .appId(appId)
                    .appName(appId)
                    .appType(platform)
                    .createTime(OffsetDateTime.now())
                    .build());
        }

        // 使用Java 8 Optional处理用户查询结果，避免空指针异常
        Optional<Users> optionalCurrentUser = Optional.ofNullable(userMapper.selectOne(
                new LambdaQueryWrapper<Users>().eq(Users::getUserId, userId)));

        Users currentUser;
        if (optionalCurrentUser.isPresent()) {
            currentUser = optionalCurrentUser.get();
            updateUser(currentUser, ipAddress, platform, userAgent, location);
        } else {
            currentUser = Users.builder()
                    .userId(userId)
                    .userAgent(userAgent)
                    .platform(platform)
                    .ipAddress(ipAddress)
                    .createTime(LocalDateTime.now())
                    .lastLoginTime(LocalDateTime.now())
                    .location(JSON.toJSONString(location))
                    .build();
            userMapper.insert(currentUser);
        }

        elasticService.ensureIndexExists("events", "actions"); // 一次性检查两个索引


        Map dataMap = new HashMap();
        dataMap.put("events",eventList);
        dataMap.put("actions",actionList);

        processAndSaveData(appId,userId, dataMap, Arrays.asList("events", "actions")); // 合并事件和操作列表处理，并一次性保存到两个索引

        return null; // 根据实际业务需求填充返回值
    }

    // 抽取出更新用户信息的方法以提高可读性
    private void updateUser(Users user, String ipAddress, String platform, String userAgent, Location location) {
        user.setLastLoginTime(LocalDateTime.now());
        user.setIpAddress(ipAddress);
        user.setPlatform(platform);
        user.setLocation(JSON.toJSONString(location));
        user.setUserAgent(userAgent);
        userMapper.update(user, new LambdaQueryWrapper<Users>().eq(Users::getUserId, user.getUserId()));
    }

    // 合并事件和操作列表，并添加应用ID
    private List<Map<String, Object>> combineAndAddAppId(List<Map<String, Object>> eventList, List<Map<String, Object>> actionList, String appId) {
        eventList.forEach(e -> e.put("appId", appId));
        actionList.forEach(a -> a.put("appId", appId));
        return Stream.concat(eventList.stream(), actionList.stream()).collect(Collectors.toList());
    }

    private void processAndSaveData(String appId, String userId,Map<String,List> dataMap, List<String> indexNames) {
        for (String indexName : indexNames) {
            List<? extends Map<String, Object>> dataList = dataMap.get(indexName);
            dataList.forEach(data -> {
                data.put("createTime", LocalDateTime.now());
                data.put("appId", appId);
                data.put("userId", userId);
                try {
                    IndexResponse response = elasticService.createByJson(indexName, UUID.randomUUID().toString(), JSON.toJSONString(data));
                    System.out.printf("reponse->",response);
                    // 可能需要对响应进行处理或记录错误
                } catch (Exception e) {
                    throw new RuntimeException("Failed to save data to index '" + indexName + "'", e);
                }
            });
        }
    }

    @Override
    public Void errorHandler(ErrorInfoDto errorInfoDto) throws Exception {
        BooleanResponse exists = client.indices().exists(e -> e.index("errors"));
        if (!exists.value()) {
            client.indices().create(c -> c.index("errors"));
        }else{
            errorInfoDto.setCreateTime(LocalDateTime.now().toString());
            IndexResponse response = elasticService.createByJson("errors", UUID.randomUUID().toString(), JSON.toJSONString(errorInfoDto));
            System.out.println("response.toString() -> " + response.toString());
            Errors errors = new Errors();
            BeanUtils.copyProperties(errorInfoDto,errors);
            errors.setEsErrorId(response.id());
            errorMapper.insert(errors);
        }
        return null;
    }
}
