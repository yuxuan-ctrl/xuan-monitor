package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.dto.PerformanceDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;

import java.io.IOException;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface PerformanceService  {

    Page<InterfaceInfo> getInterfaceList(PerformanceDTO performanceDTO);
    InterfaceInfo getInterfaceInfoById(String id);
}
