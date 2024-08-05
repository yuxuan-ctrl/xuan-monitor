package com.xuan.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xuan.common.result.Result;
import com.xuan.dao.pojo.dto.PerformanceDTO;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import com.xuan.service.ErrorsService;
import com.xuan.service.PerformanceService;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/performance")
@Api(value = "性能管理", tags = "PerformanceController")
@Slf4j
public class PerformanceController {
    @Autowired
    public PerformanceService performanceService;

    @GetMapping("/getInterfacePage")
    public Result<Page<InterfaceInfo>> getInterfacePage(PerformanceDTO performanceDTO) {
        Page<InterfaceInfo> interfacePageData = performanceService.getInterfaceList(performanceDTO);
        return Result.success(interfacePageData);
    }

    @GetMapping("/getInterfaceInfoById")
    public Result<InterfaceInfo> getInterfaceInfoById(@RequestParam(required = true, name = "id", defaultValue = "") String id) {
        InterfaceInfo interfaceInfo = performanceService.getInterfaceInfoById(id);
        return Result.success(interfaceInfo);
    }
}
