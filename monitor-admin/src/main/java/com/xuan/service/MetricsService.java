package com.xuan.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface MetricsService extends IService<Metrics> {

    MetricsVo getMetrics(String appId, Instant startTime, Instant endTime,String userId) throws IOException;
    List<MetricsVo> getChartsData (String appId, Instant startTime, Instant endTime) throws IOException;

    AppsDashboardVo getAppsDashboardData(String userId) throws IOException;

}
