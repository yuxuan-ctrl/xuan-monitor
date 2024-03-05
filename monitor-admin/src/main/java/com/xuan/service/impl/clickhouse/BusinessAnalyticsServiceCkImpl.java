package com.xuan.service.impl.clickhouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xuan.dao.mapper.clickhouse.ErrorsCkMapper;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.dao.model.StoresMetrics;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;

import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.BusinessAnalyticsService;

import com.xuan.service.ClickHouseService;
import com.xuan.service.SystemsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;

import java.util.*;


@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class BusinessAnalyticsServiceCkImpl implements BusinessAnalyticsService {
    @Autowired
    private SystemsService systemsService;

    @Autowired
    public EventsMapper eventsMapper;

    @Autowired
    public ErrorsCkMapper errorsCkMapper;

    @Autowired
    public ClickHouseService clickHouseService;

    @Override
    public StoresMetrics fetchPerformanceMetrics(String appId, Instant analysisStartTime, Instant analysisEndTime, String optionalUserId) throws IOException {
        Metrics aggregatedMetrics = clickHouseService.aggregateData(new MetricsDTO(analysisStartTime, analysisEndTime, appId, null));
        List<EventInfo> todayEventList = eventsMapper.selectList(
                        new LambdaQueryWrapper<EventInfo>()
                                .eq(StringUtils.isNoneBlank(appId),EventInfo::getAppId,appId)
                                .gt(EventInfo::getCreateTime, analysisStartTime.toEpochMilli())
                                .lt(EventInfo::getCreateTime, analysisEndTime.toEpochMilli()))
                .stream().toList();;

        return new StoresMetrics(aggregatedMetrics, todayEventList);
    }

    @Override
    public List<MetricsVo> retrieveChartDataset(String appId, Instant timeRangeStart, Instant timeRangeEnd) {
        return null;
    }

    @Override
    public AppsDashboardVo getUserAppsDashboardData(String userId) {
        List<Systems> systemList = systemsService.getSystemList();
        HashMap<String, Integer> activeUserMap = new HashMap<>();
        HashMap<String, Integer> todayUserMap = new HashMap<>();
        return null;
    }

    @Override
    public ErrorInfo getDetailedErrorInfoByIdentifier(String errorIdentifier) throws IOException {
        ErrorInfo errorInfo = errorsCkMapper.selectOne(new LambdaQueryWrapper<ErrorInfo>().eq(ErrorInfo::getErrorId, errorIdentifier));
        return errorInfo;
    }
}
