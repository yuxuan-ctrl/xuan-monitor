package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.properties.JwtProperties;
import com.xuan.common.result.PageResult;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.dao.pojo.dto.PageUserDTO;
import com.xuan.dao.pojo.dto.UserDTO;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, Users> implements UserService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    JwtProperties jwtProperties;

    @Override
    public IPage<Users> selectPage(PageUserDTO pageUserDto) {
        log.info("用戶傳來的DTO：{}", pageUserDto);
        Page<Users> page = new Page<Users>(pageUserDto.getPageIndex(), pageUserDto.getPageSize());
        IPage<Users> userPage = userMapper.selectPage(page, this.getQueryMapper(pageUserDto));
        return userPage;
    }

//    @Override
//    public PageResult<Users> getPageData(PageUserDTO pageUserDto) {
//        Page<PageUserDTO> page = new Page<PageUserDTO>(pageUserDto.getPageIndex(), pageUserDto.getPageSize());
//        IPage<Users> userPage = userMapper.getPageData(page, pageUserDto);
//
//        return new PageResult<Users>(userPage.getTotal(), userPage.getRecords(), userPage.getSize(),userPage.getCurrent());
//    }

    @Override
    public List<Users> selectList() {
        return userMapper.selectList(null);
    }

    @Override
    public Users selectById(String id) {
        return userMapper.selectById(id);
    }

    @Override
    public Users login(UserDTO userDto) {
        String userName = userDto.getUserName();
        String password = userDto.getPassWord();

        //1、根据用户名查询数据库中的数据
//        Users users = userMapper.selectByUserName(userName);

        //2、判斷是否有該用戶
//        if(users == null) {
//            throw new AccountNotFoundException("用戶不存在");
//        }

//        //3、判斷密碼是否正確
//        if(!users.getPassWord().equals(password) ){
//            throw new PasswordEditFailedException("密碼錯誤");
//        }

//        return users;
        return null;
    }

    private QueryWrapper getQueryMapper(PageUserDTO pageUserDto) {
        QueryWrapper<Users> userQueryWrapper = new QueryWrapper<Users>();
        if (pageUserDto.getId() != 0) {
            userQueryWrapper.eq("id", pageUserDto.getId());
        }
        if (pageUserDto.getUserName() != null && pageUserDto.getUserName() != "") {
            userQueryWrapper.like("user_name", pageUserDto.getUserName());
        }
        return userQueryWrapper;
    }

}
