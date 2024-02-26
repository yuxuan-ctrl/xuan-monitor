package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.result.PageResult;
import com.xuan.common.result.Result;
import com.xuan.dao.mapper.ErrorMapper;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.PageDTO;
import com.xuan.dao.pojo.dto.PageUserDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.service.ESDocumentService;
import com.xuan.service.ErrorsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class ErrorsServiceImpl extends ServiceImpl<ErrorMapper, Errors> implements ErrorsService {

    @Autowired
    public ESDocumentService esDocumentService;

    @Autowired
    public ErrorMapper errorMapper;

    @Override
    public IPage<Errors> selectPage(int pageIndex,int pageSize) {
        Page<Errors> page = new Page<Errors>(pageIndex, pageSize);
        IPage<Errors> errorsIPage = errorMapper.selectPage(page, new LambdaQueryWrapper<Errors>().orderByDesc(Errors::getCreateTime));
        return errorsIPage;
    }

    @Override
    public ErrorInfoDto getDetails(String id) throws IOException {
        return esDocumentService.getById("errors",id,ErrorInfoDto.class);
    }

    @Override
    public List<Users> selectList() {
        return null;
    }

    @Override
    public Users selectById(String id) {
        return null;
    }
}
