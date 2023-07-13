package com.xuan.controller;


import com.xuan.dao.pojo.entity.User;
import com.xuan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    public UserService userService;

    @GetMapping("/getUserPage")
    public List<User> getUserPage(){
        return userService.selectPage();
    }

    @GetMapping("/getUserById")
    public User getUserById(@RequestParam String id){
        return userService.selectById(id);
    }
}

