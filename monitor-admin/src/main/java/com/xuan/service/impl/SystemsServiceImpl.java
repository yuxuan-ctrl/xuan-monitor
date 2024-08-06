package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.dao.mapper.postgres.SystemsMapper;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.service.SystemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

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

    @Autowired
    public SystemsMapper systemsMapper;
    @Override
    public Systems getSystemById(String appId) {
        return exists(appId);
    }

    @Override
    public List<Systems> getSystemList() {
        return systemsMapper.selectList(null);
    }

    @Override
    @Transactional
    public Systems createSystem(Systems systems) {
        systems.setCreateTime(OffsetDateTime.now());
        systems.setAppId(UUID.randomUUID().toString());
        systemsMapper.insert(systems);
        return null;
    }

    @Override
    @Transactional
    public Systems editSystem(Systems systems) {
        if(!ObjectUtils.isEmpty(exists(systems.getAppId()))){
            Systems entity = Systems.builder().appType(systems.getAppType()).appName(systems.getAppName()).createTime(systems.getCreateTime()).build();
            systemsMapper.update(entity,new LambdaQueryWrapper<Systems>()
                    .eq(Systems::getAppId,systems.getAppId()));
        }
        return null;
    }

    private Systems exists(String appId){
        return systemsMapper.selectOne(new LambdaQueryWrapper<Systems>()
                .eq(Systems::getAppId,appId));
    }

}
