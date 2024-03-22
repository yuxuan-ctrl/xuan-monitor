package com.xuan.service.impl.clickhouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xuan.dao.mapper.clickhouse.InterfaceCkMapper;
import com.xuan.dao.pojo.dto.PerformanceDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import com.xuan.service.PerformanceService;
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
        Page<InterfaceInfo> page = new Page(performanceDTO.getPageIndex(), performanceDTO.getPageSize());
        Page<InterfaceInfo> interfaceInfoPage = interfaceCkMapper.selectPage(page, new LambdaQueryWrapper<InterfaceInfo>()
                .eq(StringUtils.isNoneBlank(performanceDTO.getAppId()), InterfaceInfo::getAppId, performanceDTO.getAppId())
                .eq(StringUtils.isNoneBlank(performanceDTO.getMethod()), InterfaceInfo::getMethod, performanceDTO.getMethod())
                .eq(StringUtils.isNoneBlank(performanceDTO.getRequestUrl()), InterfaceInfo::getRequestUrl, performanceDTO.getRequestUrl())
        );
//        List<InterfaceInfo> aggregatedInterfaceList = interfaceCkMapper.getAggregatedInterfaceList(performanceDTO);
        return interfaceInfoPage;
    }
}
