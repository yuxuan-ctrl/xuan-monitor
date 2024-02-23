package com.xuan.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.dao.pojo.dto.PageUserDTO;
import com.xuan.dao.pojo.dto.UserDTO;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.common.properties.JwtProperties;
import com.xuan.common.result.PageResult;
import com.xuan.common.result.Result;
import com.xuan.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
@Api(value = "用户管理",tags = "UserController")
public class UserController {

    @Autowired
    public UserService userService;

    @Autowired
    public JwtProperties jwtProperties;

    @ApiOperation(value = "用户分页查询",tags = "getUserPage")
    @GetMapping("/getUserPage")
    public Result<IPage<Users>> getUserPage(PageUserDTO pageUserDto){
        IPage<Users> res = userService.selectPage(pageUserDto);
        return Result.success(res);
    }
    @GetMapping("/getUserList")
    @ApiOperation("用户列表查询")
    public List<Users> getUserList(){
        return userService.selectList();
    }

    @GetMapping("/getUserById")
    @ApiOperation("用户通过Id查询")
    public Users getUserById(@RequestParam String id){
        return userService.selectById(id);
    }

//    @GetMapping("/getPageData")
//    @ApiOperation("手写分页查询用户列表")
//    public Result<PageResult<Users>> getPageData(PageUserDTO pageUserDto){
//        PageResult<Users> pageResult  = userService.getPageData(pageUserDto);
//        return Result.success(pageResult);
//    }

    @PostMapping("/login")
    @ApiOperation("用戶登录")
    public ResponseEntity<String> login(@RequestBody UserDTO userDto){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("");
//        Users users = userService.login(userDto);
//        Map map = new HashMap<>();
//        map.put(JwtClaimsConstant.USER_ID, users.getId());
//        String jwtToken = JwtUtil.createJWT(jwtProperties.getUserSecretKey(), jwtProperties.getUserTtl(), map);
//        LoginVo loginVo = new LoginVo();
//        BeanUtils.copyProperties(users,loginVo);
//        loginVo.setToken(jwtToken);
//        return Result.success(loginVo);

    }
}

