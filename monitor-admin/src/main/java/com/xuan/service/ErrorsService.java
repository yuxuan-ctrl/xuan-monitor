package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.common.result.PageResult;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.PageDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Users;

import java.io.IOException;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface ErrorsService extends IService<Errors> {

    IPage<Users> selectPage(ErrorInfoDto errorInfoDto);
    PageResult<ErrorInfoDto> getPageData(int pageIndex, int pageSize) throws IOException;
    List<Users> selectList();
    Users selectById(String id);
}
