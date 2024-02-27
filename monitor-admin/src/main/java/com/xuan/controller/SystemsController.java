package com.xuan.controller;


import com.xuan.common.result.Result;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.SystemsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping("/getSystemsById")
    @ApiOperation("获取系统详情")
    public Result<Systems> getSystemsById(@RequestParam(value = "appId",required = true) String appId){
        return Result.success(systemsService.getSystemById(appId));
    }

    @PostMapping("/createSystem")
    @ApiOperation("新增系统")
    public Result<Systems> createSystem(@RequestBody Systems systems){
        systemsService.createSystem(systems);
        return Result.success(null);
    }

    @PutMapping("/editSystem")
    @ApiOperation("修改系统")
    public Result<Systems> editSystem(@RequestBody Systems systems){
        systemsService.editSystem(systems);
        return Result.success(null);
    }
}

