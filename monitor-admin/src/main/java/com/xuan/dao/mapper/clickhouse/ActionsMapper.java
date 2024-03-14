package com.xuan.dao.mapper.clickhouse;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DS("clickhouse")
public interface ActionsMapper extends BaseMapper<ActionInfo> {
}
