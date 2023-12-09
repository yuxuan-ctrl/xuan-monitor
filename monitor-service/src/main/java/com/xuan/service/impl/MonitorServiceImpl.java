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

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.constant.JwtClaimsConstant;
import com.xuan.dao.mapper.WebpvuvMapper;
import com.xuan.dao.pojo.dto.EventList;
import com.xuan.dao.pojo.dto.Performance;
import com.xuan.dao.pojo.dto.WebpvuvDto;
import com.xuan.dao.pojo.entity.Webpvuv;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.properties.JwtProperties;
import com.xuan.service.MonitorService;
import com.xuan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
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
public class MonitorServiceImpl extends ServiceImpl<WebpvuvMapper, Webpvuv> implements MonitorService {

    @Autowired
    public WebpvuvMapper webpvuvMapper;

    @Autowired
    public JwtProperties jwtProperties;

    @Override
    public ReportVo recordMonitorInfo(WebpvuvDto webpvuvDto) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        log.info("token:", request.getHeader("Authorization"));
        String token = request.getHeader("Authorization").split(" ")[1];
        Claims claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), token);
        log.info("claims：{}", claims);
        log.info("监控信息：{}", webpvuvDto);
        Integer userId = (Integer) claims.get(JwtClaimsConstant.USER_ID);
        String appId = webpvuvDto.getAppId();
        String pageUrl = webpvuvDto.getPageUrl();
        String time = webpvuvDto.getTime();
        // List<HashMap<String,Object>> eventList = webpvuvDto.getEventList();
        List<EventList> eventList = webpvuvDto.getEventList();
        if (!CollectionUtils.isEmpty(eventList)) {
            eventList.stream().forEach(event -> {
                String type = event.getType();
                String uuid = event.getUuid();
                Integer timestamp = event.getTimestamp();
                Object errorInfo = event.getErrorInfo();
                Performance data = event.getData();
                if (type.equals("action")) {
                    QueryWrapper<Webpvuv> wrapper = new QueryWrapper<>();
                    wrapper.eq("webpvuv.page_url", pageUrl);
                    Webpvuv item = webpvuvMapper.selectOne(wrapper);
                    log.info("list：{}", item);
                    if (ObjectUtils.isEmpty(item)) {
                        Webpvuv webpvuv = Webpvuv
                                .builder()
                                .appId(appId)
                                .type(type)
                                .pv(1)
                                .uv(userId)
                                .pageUrl(pageUrl)
                                .build();
                        webpvuvMapper.insert(webpvuv);
                    } else {
                        Webpvuv webpvuv = new Webpvuv();
                        webpvuv.setPv(item.getPv() + 1);
                        webpvuvMapper.update(webpvuv, null);
                    }
                }

            });
        }
        ReportVo reportVo = new ReportVo(appId, pageUrl, "2312", webpvuvDto);
        return reportVo;
    }
}
