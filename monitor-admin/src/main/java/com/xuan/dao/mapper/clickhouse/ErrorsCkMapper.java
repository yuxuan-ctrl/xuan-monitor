package com.xuan.dao.mapper.clickhouse;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DS("clickhouse")
public interface ErrorsCkMapper extends BaseMapper<ErrorInfo> {
}
