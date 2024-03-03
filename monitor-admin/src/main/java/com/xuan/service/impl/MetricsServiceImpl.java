package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.dao.mapper.postgres.ErrorMapper;
import com.xuan.dao.mapper.postgres.MetricsMapper;
import com.xuan.dao.model.PageViewInfo;
import com.xuan.dao.model.StoresMetrics;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.BusinessAnalyticsService;
import com.xuan.service.MetricsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MetricsServiceImpl extends ServiceImpl<MetricsMapper, Metrics> implements MetricsService {
    @Autowired
    private MetricsMapper metricsMapper;
    @Autowired
    private BusinessAnalyticsService businessAnalyticsService;

    @Autowired
    private ErrorMapper errorMapper;

    @Autowired
    private CalculateUtil calculateUtil;

    @Override
    public MetricsVo getMetrics(String appId, Instant startTime, Instant endTime, String userId) throws IOException {

        StoresMetrics storesMetrics = businessAnalyticsService.fetchPerformanceMetrics(appId, startTime, endTime, userId);

        // 计算并排名页面访问量
        List<PageViewInfo> popularList = calculateUtil.countAndRankPageViews(storesMetrics.getTodayEventList());

        // 计算错误类型分布
        Map<String, Long> errorsTypeMap = calculateUtil.calculateErrorsType(errorMapper.selectList(null));

        // 查询最近一次的Metrics数据
        Metrics pastByMetric = getLastMetricsBeforeTime(startTime);

        // 计算今日错误总数
        Long dailyErrorCount = countTodayErrors(errorMapper, startTime, endTime);

        // 获取应用的所有错误列表
        List<Errors> totalErrorList = getApplicationErrors(errorMapper, appId);

        // 计算已解决错误数量
        Long resolvedErrorCount = totalErrorList.stream().count() ;

        // 构建MetricsVo对象
        MetricsVo metricsVo = buildMetricsVo(storesMetrics.getAggregatedMetrics(), pastByMetric, totalErrorList.size(), dailyErrorCount, resolvedErrorCount, popularList, errorsTypeMap);

        // 处理空值情况
        if (!ObjectUtils.isEmpty(storesMetrics.getAggregatedMetrics())) {
            BeanUtils.copyProperties(storesMetrics.getAggregatedMetrics(), metricsVo);
        }
        if (!ObjectUtils.isEmpty(pastByMetric)) {
            metricsVo.setPastByMetric(pastByMetric);
        }

        return metricsVo;
    }

    @Override
    public List<MetricsVo> getChartsData(String appId, Instant startTime, Instant endTime) throws IOException {
        List<Metrics> metricList = metricsMapper.selectList(new LambdaQueryWrapper<Metrics>()
                .gt(Metrics::getCreateTime, startTime)
                .lt(Metrics::getCreateTime, endTime)
                .orderByAsc(Metrics::getCreateTime));

        return metricList.stream().map(metrics -> new MetricsVo(metrics.getTotalPageViews(), metrics.getUniqueVisitors(), metrics.getCreateTime())).collect(Collectors.toList());
    }

    @Override
    public AppsDashboardVo getAppsDashboardData(String userId) throws IOException {
        return businessAnalyticsService.getUserAppsDashboardData(userId);
    }

    private Metrics getLastMetricsBeforeTime(Instant startTime) {
        return metricsMapper.selectOne(new LambdaQueryWrapper<Metrics>()
                .lt(Metrics::getCreateTime, startTime)
                .orderByDesc(Metrics::getCreateTime)
                .last("LIMIT 1"));
    }

    private Long countTodayErrors(ErrorMapper errorMapper, Instant startTime, Instant endTime) {
        return errorMapper.selectCount(new LambdaQueryWrapper<Errors>()
                .between(Errors::getCreateTime, startTime, endTime));
    }

    private List<Errors> getApplicationErrors(ErrorMapper errorMapper, String appId) {
        return errorMapper.selectList(new LambdaQueryWrapper<Errors>().eq(Errors::getAppId, appId));
    }

    private MetricsVo buildMetricsVo(Metrics aggregatedMetrics, Metrics pastByMetric, long totalErrorCount, long dailyErrorCount, long resolvedErrorCount, List<PageViewInfo> popularList, Map<String, Long> errorsTypeMap) {
        MetricsVo metricsVo = new MetricsVo();
        metricsVo.setTotalErrorCount(totalErrorCount);
        metricsVo.setDailyErrorCount(dailyErrorCount);
        metricsVo.setResolvedErrorCount(resolvedErrorCount);
        metricsVo.setPopularList(popularList);
        metricsVo.setErrorsTypeMap(errorsTypeMap);

        return metricsVo;
    }

}
