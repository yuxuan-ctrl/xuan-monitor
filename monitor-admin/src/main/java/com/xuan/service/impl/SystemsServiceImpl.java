package com.xuan.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.dao.mapper.SystemsMapper;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.service.SystemsService;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Service
public class SystemsServiceImpl extends ServiceImpl<SystemsMapper, Systems> implements SystemsService {

}
