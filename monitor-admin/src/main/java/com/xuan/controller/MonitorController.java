package com.xuan.controller;

import com.xuan.dao.pojo.dto.WebpvuvDto;
import com.xuan.dao.pojo.entity.Webpvuv;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.result.Result;
import com.xuan.service.MonitorService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/monitor")
@Api(tags = "监控接口")
@Slf4j


public class MonitorController {

    @Autowired
    public MonitorService monitorService;

    @PostMapping("/report")
    @ApiOperation("监控信息上传")
    public Result<ReportVo> report(@RequestBody WebpvuvDto webpvuvDto) throws Exception{
        ReportVo reportVo = monitorService.recordMonitorInfo(webpvuvDto);
        return Result.success(reportVo);
    }

    @GetMapping("/report/test")
    @ApiOperation("监控信息上传测试")
    public Result<Webpvuv> testreport(WebpvuvDto webpvuvDto) throws Exception{
        log.info("监控信息：{}",webpvuvDto);
        Webpvuv webpvuvVo = new Webpvuv();
        return Result.success(webpvuvVo);
    }
}
