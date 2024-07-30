package com.xuan.dao.mapper.clickhouse;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xuan.dao.pojo.dto.PerformanceDTO;
import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
import com.xuan.dao.pojo.entity.clickhouse.InterfaceInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

@Mapper
@DS("clickhouse")
public interface InterfaceCkMapper extends BaseMapper<InterfaceInfo> {
    List<InterfaceInfo> getAggregatedInterfaceList(@Param("performanceDTO") PerformanceDTO performanceDTO);

    int batchInsert(List<InterfaceInfo> interfaceInfos);

}
