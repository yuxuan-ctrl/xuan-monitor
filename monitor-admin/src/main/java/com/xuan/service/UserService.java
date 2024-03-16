package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.common.result.PageResult;
import com.xuan.dao.pojo.dto.PageUserDTO;
import com.xuan.dao.pojo.dto.UserDTO;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.dao.pojo.vo.RegionUserVO;

import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface UserService extends IService<Users> {

    IPage<Users> selectPage(PageUserDTO pageUserDto);

    /**
     * @return
     */
//    PageResult<Users> getPageData(PageUserDTO pageUserDto);
    List<Users> selectList();

    Users selectById(String id);

    List<RegionUserVO> getUsersByRegion(String appId);

    Users login(UserDTO userDto);
}
