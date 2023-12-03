package com.xuan.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.constant.JwtClaimsConstant;
import com.xuan.dao.pojo.dto.PageUserDto;
import com.xuan.dao.pojo.dto.UserDto;
import com.xuan.dao.pojo.entity.User;
import com.xuan.dao.pojo.vo.LoginVo;
import com.xuan.properties.JwtProperties;
import com.xuan.result.PageResult;
import com.xuan.result.Result;
import com.xuan.service.UserService;
import com.xuan.utils.JwtUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@Api(tags = "用户管理")
public class UserController {

    @Autowired
    public UserService userService;

    @Autowired
    public JwtProperties jwtProperties;
    @ApiOperation("用户分页查询")
    @GetMapping("/getUserPage")
    public Result<IPage<User>> getUserPage(PageUserDto pageUserDto){
        IPage<User> res = userService.selectPage(pageUserDto);
        return Result.success(res);
    }
    @GetMapping("/getUserList")
    @ApiOperation("用户列表查询")
    public List<User> getUserList(){
        return userService.selectList();
    }

    @GetMapping("/getUserById")
    @ApiOperation("用户通过Id查询")
    public User getUserById(@RequestParam String id){
        return userService.selectById(id);
    }

    @GetMapping("/getPageData")
    @ApiOperation("手写分页查询用户列表")
    public Result<PageResult> getPageData(PageUserDto pageUserDto){
        PageResult pageResult  = userService.getPageData(pageUserDto);
        return Result.success(pageResult);
    }

    @PostMapping("/login")
    @ApiOperation("用戶登录")
    public Result<LoginVo> login(UserDto userDto){
        User user = userService.login(userDto);
        Map map = new HashMap<>();
        map.put(JwtClaimsConstant.USER_ID,user.getId());
        String jwtToken = JwtUtil.createJWT(jwtProperties.getUserSecretKey(), jwtProperties.getUserTtl(), map);
        LoginVo loginVo = new LoginVo();
        BeanUtils.copyProperties(user,loginVo);
        loginVo.setToken(jwtToken);
        return Result.success(loginVo);
    }
}

