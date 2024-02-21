package com.xuan.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.common.result.Result;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
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

@RestController
@RequestMapping("/Metrics")
@Api(tags = "指标接口")
@Slf4j
public class EventsController {
    @Autowired
    private MetricsService metricsService;

    @GetMapping("/getMetrics")
    @ApiOperation("指标获取")
    public Result<Metrics> getMetrics(@RequestParam(required = false,name = "userId",defaultValue = "") String userId,
                                            @RequestParam(required = false,name = "startTime",defaultValue = "") String startTime,
                                            @RequestParam(required = false,name = "endTime",defaultValue = "") String endTime) throws IOException {
        Metrics res = metricsService.getMetrics(userId,startTime,endTime);
        return Result.success(res);
    }
}
