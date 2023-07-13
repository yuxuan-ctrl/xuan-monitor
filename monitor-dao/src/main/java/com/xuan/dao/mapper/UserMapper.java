package com.xuan.dao.mapper;

import com.xuan.dao.pojo.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

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
public interface UserMapper extends BaseMapper<User> {

    List<User> selectPage();

    User selectById(String id);

}
