package com.xuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.entity.Systems;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface SystemsService extends IService<Systems> {

    Systems getSystemById(String appId);
    List<Systems> getSystemList();
    Systems createSystem(Systems systems);
    Systems editSystem(Systems systems);
}
