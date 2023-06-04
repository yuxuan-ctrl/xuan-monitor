package com.xuan.service;

import com.xuan.dao.domain.User;
import com.xuan.dao.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SysUserServiceImpl implements SysUserService{

    @Autowired
    private SysUserMapper sysUserMapper;

    @Override
    public User getUserById(String id) {
       return sysUserMapper.selectUserById(id);
    }
}

