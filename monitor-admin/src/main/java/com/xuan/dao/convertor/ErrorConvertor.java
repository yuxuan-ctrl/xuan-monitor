package com.xuan.dao.convertor;

import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.entity.Errors;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ErrorConvertor {
    Errors responseToEntity(ErrorInfoDto errorInfoDto);
}
