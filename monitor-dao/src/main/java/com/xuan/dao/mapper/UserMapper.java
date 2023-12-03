package com.xuan.dao.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xuan.dao.pojo.dto.PageUserDto;
import com.xuan.dao.pojo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

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
    User selectByUserName(@Param("userName") String userName);

    @Override
    @Select("Select * From user")
    List<User> selectList(Wrapper<User> queryWrapper);

    @Override
    <P extends IPage<User>> P selectPage(P page, @Param("ew") Wrapper<User> queryWrapper);

    @Override
    int deleteById(Serializable id);

    @Override
    int update(User entity, Wrapper<User> updateWrapper);

  IPage<User>  getPageData(Page<PageUserDto> page, @Param("PageUserDto") PageUserDto pageUserDto);

}
