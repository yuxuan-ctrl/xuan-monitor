package com.xuan.service;

import com.xuan.dao.model.StoresMetrics;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface BusinessAnalyticsService {
    /**
     * 获取指定应用程序在指定时间范围内的性能指标数据
     * @param appId 应用程序ID
     * @param analysisStartTime 分析开始时间
     * @param analysisEndTime 分析结束时间
     * @param optionalUserId 可选的用户ID，取决于具体业务场景是否需要关联用户
     * @return 统计指标数据视图对象
     */

    StoresMetrics fetchPerformanceMetrics(String appId, Instant analysisStartTime, Instant analysisEndTime, String optionalUserId) throws IOException;

    /**
     * 获取指定应用程序在指定时间范围内的可视化图表数据
     * @param appId 应用程序ID
     * @param timeRangeStart 时间范围开始点
     * @param timeRangeEnd 时间范围结束点
     * @return 可视化图表数据列表视图对象
     */
    List<MetricsVo> retrieveChartDataset(String appId, Instant timeRangeStart, Instant timeRangeEnd);

    /**
     * 获取用户专属的应用程序仪表板概览数据
     * @param userId 用户ID
     * @return 应用程序仪表板概览视图对象
     */
    AppsDashboardVo getUserAppsDashboardData(String userId);

    /**
     * 根据错误标识符获取详细的错误信息记录
     * @param errorIdentifier 错误唯一标识符
     * @return 错误详细信息对象
     */
    ErrorInfoDto getDetailedErrorInfoByIdentifier(String errorIdentifier) throws IOException;
}
