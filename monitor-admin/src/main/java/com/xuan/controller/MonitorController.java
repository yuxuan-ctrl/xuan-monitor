package com.xuan.controller;

import com.xuan.common.result.Result;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.service.MonitorService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/monitor")
@Api(value = "监控上报",tags = "MonitorController")
@Slf4j
public class MonitorController {

    @Autowired
    public MonitorService monitorService;

    @PostMapping("/report")
    @ApiOperation("监控信息上传")
    public Result<ReportVo> report(@RequestBody EventsDTO eventsDto, HttpServletRequest httpRequest) throws Exception{
        log.info("AppId：{}",eventsDto.getAppId());
        log.info("当前进入页面：{}",eventsDto.getCurrentEnterPageUrl());
        ReportVo reportVo = monitorService.recordMonitorInfo(eventsDto,httpRequest);
        return Result.success(reportVo);
    }

    @PostMapping("/errorReport")
    @ApiOperation("监控信息上传")
    public Result<ReportVo> errorReport(@RequestBody ErrorInfo errorInfo) throws Exception{

        monitorService.errorHandler(errorInfo);

        return Result.success(null,"上传成功");
    }

}
