package com.xuan.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.common.result.Result;
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
import java.time.Duration;
import java.time.Instant;

@RestController
@RequestMapping("/Metrics")
@Api(value = "指标管理",tags = "EventsController")
@Slf4j
public class EventsController {
    @Autowired
    private MetricsService metricsService;

    @GetMapping("/getMetrics")
    @ApiOperation("指标获取")
    public Result<MetricsVo> getMetrics(@RequestParam(required = false,name = "userId",defaultValue = "") String userId,
                                            @RequestParam(required = false,name = "hoursBack",defaultValue = "24") String hoursBack
                                            ) throws IOException {
        Instant endTime = Instant.now();
        Duration duration = Duration.ofHours(Long.parseLong(hoursBack));
        Instant startTime = endTime.minus(duration);
        MetricsVo res = metricsService.getMetrics(userId,startTime,endTime);
        return Result.success(res);
    }
}
