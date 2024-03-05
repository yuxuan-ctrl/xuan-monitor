package com.xuan.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.common.result.Result;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.service.ErrorsService;
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
@RequestMapping("/errors")
@Api(value = "错误管理",tags = "ErrorsController")
@Slf4j
public class ErrorsController {
    @Autowired
    public ErrorsService errorsService;

    @GetMapping("/getPageData")
    @ApiOperation("错误列表获取")
    public Result<IPage<Errors>> getPageData(@RequestParam int pageIndex, @RequestParam int pageSize
            ,@RequestParam(required = false, name = "userId",defaultValue = "") String userId) throws IOException {
        IPage<Errors> res = errorsService.selectPage(pageIndex,pageSize,userId);
        return Result.success(res);
    }

    @GetMapping("/getDetails")
    @ApiOperation("错误详情获取")
    public Result<ErrorInfo> getDetails(@RequestParam String id) throws IOException {
        ErrorInfo detail = errorsService.getDetails(id);
        return Result.success(detail);
    }
}
