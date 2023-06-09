package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.entity.User;

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

    IPage<User> selectPage();
    List<User> selectList();
    User selectById(String id);
}
