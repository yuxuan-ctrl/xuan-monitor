package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.entity.Metrics;
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
public interface MetricsService extends IService<Metrics> {

    Metrics getMetrics(String userId,String startTime,String endTime) throws IOException;

}
