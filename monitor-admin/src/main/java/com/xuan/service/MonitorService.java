/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-12-05 14:03:01
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-06 16:00:22
 * @FilePath: \xuan-monitor\monitor-service\src\main\java\com\xuan\service\MonitorService.java
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
package com.xuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.vo.ReportVo;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface MonitorService extends IService<Metrics> {
    ReportVo recordMonitorInfo(EventsDTO eventsDto, HttpServletRequest httpRequest) throws IOException;


    Void errorHandler(ErrorInfoDto errorInfoDto) throws Exception;
}
