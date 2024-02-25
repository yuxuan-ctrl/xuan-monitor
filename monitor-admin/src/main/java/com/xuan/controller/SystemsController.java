package com.xuan.controller;


import com.xuan.common.result.Result;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.SystemsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@RestController
@RequestMapping("/systems")
@Api(value = "系统管理",tags = "SystemsController")
public class SystemsController {

    @Autowired
    public SystemsService systemsService;
    @GetMapping("/getSystemsList")
    @ApiOperation("获取系统列表")
    public Result <List<Systems>> getSystemsList(){
        return Result.success(systemsService.list());
    }

}

