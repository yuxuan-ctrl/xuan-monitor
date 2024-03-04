/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-03-04 09:05:08
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-03-04 11:01:05
 * @FilePath: \monitor-admin\src\main\java\com\xuan\dao\mapper\postgres\ErrorMapper.java
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
package com.xuan.dao.mapper.postgres;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xuan.dao.pojo.entity.Errors;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Mapper
public interface ErrorMapper extends BaseMapper<Errors> {

}
