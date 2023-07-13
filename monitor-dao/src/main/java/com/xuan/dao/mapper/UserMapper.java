package com.xuan.dao.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.dao.pojo.entity.User;
import org.apache.ibatis.annotations.Mapper;

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
public interface UserMapper extends BaseMapper<User> {

    @Override
    int insert(User entity);

    @Override
    User selectById(Serializable id);

    @Override
    List<User> selectList(Wrapper<User> queryWrapper);

    @Override
    <P extends IPage<User>> P selectPage(P page, Wrapper<User> queryWrapper);

    @Override
    int deleteById(Serializable id);

    @Override
    int update(User entity, Wrapper<User> updateWrapper);
}
