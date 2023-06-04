package com.xuan.dao.mapper;

import com.xuan.dao.domain.User;

public interface SysUserMapper {
    User selectUserById(String id);
}
