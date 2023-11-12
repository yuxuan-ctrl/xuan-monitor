package com.xuan.controller;

import com.xuan.dao.pojo.dto.WebpvuvDto;
import com.xuan.dao.pojo.entity.Webpvuv;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/monitor")
@Api(tags = "监控接口")
@Slf4j

public class MonitorController {
    @PostMapping("/report")
    @ApiOperation("监控信息上传")
    public Result<ReportVo> report(WebpvuvDto webpvuvDto) throws Exception{
        log.info("监控信息：{}",webpvuvDto);
        ReportVo reportVo = new ReportVo("1123","1232","2312","213",webpvuvDto);
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
