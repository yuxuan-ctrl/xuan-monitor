package com.xuan.controller;

import com.xuan.dao.domain.User;
import com.xuan.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SysUserController {
    @Autowired
    private SysUserService sysUserService;

    @GetMapping("/getUserById/{id}")
    public User getUserById(@PathVariable String id){
     User user = sysUserService.getUserById(id);
     return user;
    }
}
