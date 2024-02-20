package com.xuan.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.common.result.PageResult;
import com.xuan.common.result.Result;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.PageDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Users;
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
@Api(tags = "错误接口")
@Slf4j
public class ErrorsController {
    @Autowired
    public ErrorsService errorsService;

    @GetMapping("/getPageData")
    @ApiOperation("错误列表获取")
    public Result<IPage<Errors>> getPageData(@RequestParam int pageIndex, @RequestParam int pageSize) throws IOException {
        IPage<Errors> res = errorsService.selectPage(pageIndex,pageSize);
        return Result.success(res);
    }

    @GetMapping("/getDetails")
    @ApiOperation("错误详情获取")
    public Result<ErrorInfoDto> getDetails(@RequestParam String id) throws IOException {
        ErrorInfoDto detail = errorsService.getDetails(id);
        return Result.success(detail);
    }
}
