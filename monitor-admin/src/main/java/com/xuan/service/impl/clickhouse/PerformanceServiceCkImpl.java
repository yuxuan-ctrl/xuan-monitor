package com.xuan.service.impl.clickhouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xuan.dao.mapper.clickhouse.InterfaceCkMapper;
import com.xuan.dao.pojo.dto.PerformanceDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import com.xuan.service.PerformanceService;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerformanceServiceCkImpl implements PerformanceService {

    @Autowired
    public InterfaceCkMapper interfaceCkMapper;

    @Override
    public Page<InterfaceInfo> getInterfaceList(PerformanceDTO performanceDTO) {
        Page<InterfaceInfo> page = new Page<>(performanceDTO.getPageIndex(), performanceDTO.getPageSize());

        LambdaQueryWrapper<InterfaceInfo> queryWrapper = new LambdaQueryWrapper<InterfaceInfo>()
                .eq(StringUtils.isNoneBlank(performanceDTO.getAppId()), InterfaceInfo::getAppId, performanceDTO.getAppId())
                .eq(StringUtils.isNoneBlank(performanceDTO.getMethod()), InterfaceInfo::getMethod, performanceDTO.getMethod())
                .eq(StringUtils.isNoneBlank(performanceDTO.getMethod()), InterfaceInfo::getMethod, performanceDTO.getMethod())
                .eq(StringUtils.isNoneBlank(performanceDTO.getStatus()), InterfaceInfo::getStatus, performanceDTO.getStatus())
                .gt(StringUtils.isNoneBlank(performanceDTO.getStartTime()), InterfaceInfo::getCreateTime, performanceDTO.getStartTime())
                .lt(StringUtils.isNoneBlank(performanceDTO.getEndTime()), InterfaceInfo::getCreateTime, performanceDTO.getEndTime())
                .like(StringUtils.isNoneBlank(performanceDTO.getRequestUrl()), InterfaceInfo::getRequestUrl, performanceDTO.getRequestUrl());

        // 根据 duration 添加过滤条件
        if (StringUtils.isNotBlank(performanceDTO.getTimeStep())) {
            switch (performanceDTO.getTimeStep()) {
                case "1":
                    queryWrapper.le(InterfaceInfo::getDuration, 100);
                    break;
                case "2":
                    queryWrapper.between(InterfaceInfo::getDuration, 100, 500);
                    break;
                case "3":
                    queryWrapper.between(InterfaceInfo::getDuration, 500, 1000);
                    break;
                case "4":
                    queryWrapper.ge(InterfaceInfo::getDuration, 1000);
                    break;
                default:
                    // 不做任何操作
                    break;
            }
        }

        Page<InterfaceInfo> interfaceInfoPage = interfaceCkMapper.selectPage(page, queryWrapper);

        return interfaceInfoPage;
    }

    @Override
    public InterfaceInfo getInterfaceInfoById(String id) {
        return interfaceCkMapper.selectById(id);
    }
}
