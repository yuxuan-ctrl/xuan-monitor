package com.xuan.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.common.result.Result;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.MetricsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/Metrics")
@Api(value = "指标管理",tags = "EventsController")
@Slf4j
public class EventsController {
    @Autowired
    private MetricsService metricsService;

    @GetMapping("/getMetrics")
    @ApiOperation("指标获取")
    public Result<MetricsVo> getMetrics(@RequestParam(required = false, name = "appId", defaultValue = "") String appId,
                                        @RequestParam(required = false, name = "userId", defaultValue = "") String userId,
                                        @RequestParam(required = false, name = "currentDay", defaultValue = "") String currentDay) throws IOException {

        List<Instant> adjustedDayBoundary = DateFormatUtils.getAdjustedDayBoundary(currentDay);

        Instant startTime = adjustedDayBoundary.get(0);
        Instant endTime = adjustedDayBoundary.get(1);

        MetricsVo res = metricsService.getMetrics(appId, startTime, endTime,userId);
        return Result.success(res);
    }

    @GetMapping("/getChartsData")
    @ApiOperation("获取图表数据")
        public Result<List<MetricsVo>> getChartsData(@RequestParam(required = false, name = "appId", defaultValue = "") String appId,
                                        @RequestParam(required = false, name = "startTime", defaultValue = "") String startTime,
                                               @RequestParam(required = false, name = "endTime", defaultValue = "") String endTime) throws IOException {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateFormatUtils.ISO_8601_EXT_DATE_PATTERN);
        ZoneId targetZoneId = ZoneId.of("Asia/Shanghai");

        Instant startTimeInstant = LocalDate.parse(startTime, formatter).atStartOfDay(targetZoneId).toInstant().plusMillis(TimeUnit.HOURS.toMillis(8));
        Instant endTimeInstant = LocalDate.parse(endTime, formatter).atStartOfDay(targetZoneId).toInstant().plusMillis(TimeUnit.HOURS.toMillis(8));

        List<MetricsVo> res = metricsService.getChartsData(appId, startTimeInstant, endTimeInstant);
        return Result.success(res);
    }

    @GetMapping("/getAppsDashboardData")
    @ApiOperation("获取图表数据")
    public Result<MetricsVo> getAppsDashboardData(@RequestParam(required = false, name = "appId", defaultValue = "") String appId,
                                                  @RequestParam(required = false, name = "userId", defaultValue = "") String userId) throws IOException {



        MetricsVo res = metricsService.getAppsDashboardData(appId,userId);
        return Result.success(res);
    }
}

