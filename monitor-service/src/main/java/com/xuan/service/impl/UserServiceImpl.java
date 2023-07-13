package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.dao.pojo.entity.User;
import com.xuan.service.UserService;
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
    public IPage<User> selectPage() {
        Page<User> page = new Page<User>(1, 10);
        IPage<User> userPage = userMapper.selectPage(page,null);
        return userPage;
    }

    @Override
    public List<User> selectList() {
        return userMapper.selectList(null);
    }

    @Override
    public User selectById(String id) {
        return userMapper.selectById(id);
    }
}
