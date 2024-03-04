package com.xuan.dao.mapper.clickhouse;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xuan.dao.model.EventInfo;
import org.apache.ibatis.annotations.Mapper;

@DS("clickhouse")
@Mapper
public interface EventsMapper extends BaseMapper<EventInfo> {
}
