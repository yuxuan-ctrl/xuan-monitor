package com.xuan.dao.mapper.postgres;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xuan.dao.pojo.entity.Systems;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@Mapper
public interface SystemsMapper extends BaseMapper<Systems> {
    List<Systems>selectNewList();

}
