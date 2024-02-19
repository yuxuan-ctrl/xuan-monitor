package com.xuan.controller;

import com.xuan.common.result.PageResult;
import com.xuan.common.result.Result;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.PageDTO;
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
@Api(tags = "错误接口")
@Slf4j
public class ErrorsController {
    @Autowired
    public ErrorsService errorsService;

    @GetMapping("/getPageData")
    @ApiOperation("监控信息上传测试")
    public Result<PageResult<ErrorInfoDto>> getPageData(@RequestParam int pageIndex,
                                                        @RequestParam int pageSize) throws IOException {
        PageResult<ErrorInfoDto> pageData = errorsService.getPageData(pageIndex,pageSize);
        return Result.success(pageData);
    }
}
