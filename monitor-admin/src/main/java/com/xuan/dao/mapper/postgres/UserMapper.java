package com.xuan.dao.mapper.postgres;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xuan.dao.pojo.entity.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.io.Serializable;
import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@Mapper
public interface UserMapper extends BaseMapper<Users> {



}
