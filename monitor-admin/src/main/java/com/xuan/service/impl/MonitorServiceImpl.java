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


import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.common.utils.IpUtil;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.mapper.postgres.SystemsMapper;
import com.xuan.dao.mapper.postgres.UserMapper;
import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.dao.model.Location;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.entity.*;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.service.ErrorLoggingService;
import com.xuan.service.MonitorService;
import com.xuan.service.MonitoringDataStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.List;


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
public class MonitorServiceImpl extends ServiceImpl<EventsMapper, EventInfo> implements MonitorService {

    @Autowired
    private MonitoringDataStorageService monitoringDataStorageService;

    @Autowired
    private ErrorLoggingService errorLoggingService;
    @Autowired
    public UserMapper userMapper;
    @Autowired
    public SystemsMapper systemsMapper;

    @Override
    public ReportVo recordMonitorInfo(EventsDTO eventsDto, HttpServletRequest httpRequest) throws IOException {
        String appId = eventsDto.getAppId();
        String userId = eventsDto.getUserId();
        String platform = eventsDto.getPlatform();
        String userAgent = eventsDto.getUserAgent();
        String ipAddress = CalculateUtil.getIpAddress(httpRequest);
        Location location = eventsDto.getLocation();
        List<ActionInfo> actionList = eventsDto.getActionList();
        List<EventInfo> eventList = eventsDto.getEventList();
        List<InterfaceInfo> interfaceList = eventsDto.getInterfaceList();

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
                    .belongCity(IpUtil.getIpRegion(ipAddress))
                    .build();
            userMapper.insert(currentUser);
        }

        monitoringDataStorageService.recordMonitoringData(appId,userId,actionList,eventList,interfaceList);

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


    @Override
    public Void errorHandler(ErrorInfo errorInfo) throws Exception {
        errorLoggingService.logAndPersistError(errorInfo);
        return null;
    }
}
