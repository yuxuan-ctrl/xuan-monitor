package com.xuan.service.impl;

import com.xuan.dao.pojo.entity.User;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    UserMapper userMapper;
    @Override
    public List<User> selectPage() {
        return userMapper.selectPage();
    }

    @Override
    public User selectById(String id) {
        return userMapper.selectById(id);
    }
}
