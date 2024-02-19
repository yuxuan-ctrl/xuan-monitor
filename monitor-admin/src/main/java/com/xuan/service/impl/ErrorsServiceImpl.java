package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.result.PageResult;
import com.xuan.dao.mapper.ErrorMapper;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.PageDTO;
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

    @Override
    public IPage<Users> selectPage(ErrorInfoDto errorInfoDto) {
        return null;
    }

    @Override
    public PageResult<ErrorInfoDto> getPageData(int pageIndex,int pageSize) throws IOException {
        PageResult<ErrorInfoDto> pageData = esDocumentService.queryByPage("errors", "createTime", ErrorInfoDto.class, pageIndex, pageSize);
        return pageData;
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
