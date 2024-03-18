package com.xuan.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.pojo.dto.PageUserDTO;
import com.xuan.dao.pojo.dto.UserDTO;
import com.xuan.dao.pojo.dto.UserDetailsDTO;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.common.properties.JwtProperties;
import com.xuan.common.result.PageResult;
import com.xuan.common.result.Result;
import com.xuan.dao.pojo.vo.RegionUserVO;
import com.xuan.dao.pojo.vo.UserDetailsVO;
import com.xuan.dao.pojo.vo.UsersVo;
import com.xuan.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@RestController
@RequestMapping("/user")
@Api(value = "用户管理", tags = "UserController")
public class UserController {

    @Autowired
    public UserService userService;

    @Autowired
    public JwtProperties jwtProperties;

    @ApiOperation(value = "用户分页查询", tags = "getUserPage")
    @GetMapping("/getUserPage")
    public Result<Page<UsersVo>> getUserPage(PageUserDTO pageUserDto) {
        IPage<Users> usersPage = userService.selectPage(pageUserDto);
        List<UsersVo> usersVoList = usersPage.getRecords().stream().map(users -> UsersVo.builder()
                .userId(users.getUserId())
                .userAgent(users.getUserAgent())
                .lastLoginTime(DateFormatUtils.format(users.getLastLoginTime()))
                .createTime(DateFormatUtils.format(users.getCreateTime()))
                .location(users.getLocation())
                .platform(users.getPlatform())
                .ipAddress(users.getIpAddress())
                .build()).collect(Collectors.toList());

        long pageNum = usersPage.getPages();
        long pageSize = usersPage.getSize();
        Pageable pageable = PageRequest.of((int) (pageNum - 1), (int) pageSize); // 注意pageNum是从1开始计数的，PageRequest中是从0开始

        Page<UsersVo> usersVoPage = new PageImpl<>(usersVoList, pageable, usersPage.getTotal());

        return Result.success(usersVoPage);
    }

    @GetMapping("/getUserList")
    @ApiOperation("用户列表查询")
    public List<Users> getUserList() {
        return userService.selectList();
    }

    @GetMapping("/getUserById")
    @ApiOperation("用户通过Id查询")
    public Users getUserById(@RequestParam String id) {
        return userService.selectById(id);
    }

    @GetMapping("/getUsersByRegion")
    @ApiOperation("用户地域分布数量")
    public Result<List<RegionUserVO>> getUsersByRegion(@RequestParam String appId) {
        return Result.success(userService.getUsersByRegion(appId));
    }

    @GetMapping("/getUserDetails")
    @ApiOperation("获取用户详情信息")
    public Result<UserDetailsVO> getUserDetails(UserDetailsDTO userDetailsDTO){
        UserDetailsVO userDetailsVO  = userService.getUserDetails(userDetailsDTO);
        return Result.success(userDetailsVO);
    }

    @PostMapping("/login")
    @ApiOperation("用戶登录")
    public ResponseEntity<String> login(@RequestBody UserDTO userDto) {
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

