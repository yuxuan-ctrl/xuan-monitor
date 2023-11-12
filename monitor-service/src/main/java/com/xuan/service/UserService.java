package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.dto.PageUserDto;
import com.xuan.dao.pojo.dto.UserDto;
import com.xuan.dao.pojo.entity.User;
import com.xuan.result.PageResult;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface UserService extends IService<User> {

    IPage<User> selectPage(PageUserDto pageUserDto);

    /**
     *
     * @return
     */
    PageResult getPageData(PageUserDto pageUserDto);
    List<User> selectList();
    User selectById(String id);

    User login(UserDto userDto);
}
