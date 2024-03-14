package com.xuan.service.impl.clickhouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.mapper.clickhouse.ActionsMapper;
import com.xuan.dao.mapper.clickhouse.ErrorsCkMapper;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.pojo.entity.clickhouse.BaseInfo;
import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class BusinessAnalyticsServiceCkImpl implements BusinessAnalyticsService {
    @Autowired
    private SystemsService systemsService;

    @Autowired
    public EventsMapper eventsMapper;

    @Autowired
    public ActionsMapper actionsMapper;

    @Autowired
    public ErrorsCkMapper errorsCkMapper;

    @Autowired
    public ClickHouseService clickHouseService;

    @Override
    public StoresMetrics fetchPerformanceMetrics(String appId, Instant analysisStartTime, Instant analysisEndTime, String optionalUserId) throws IOException {
        Metrics aggregatedMetrics = clickHouseService.aggregateData(new MetricsDTO(analysisStartTime, analysisEndTime, appId, null));

        String startStr = DateFormatUtils.format(analysisStartTime.atZone(ZoneId.of("Asia/Shanghai")).toLocalDateTime());
        String endStr = DateFormatUtils.format(analysisEndTime.atZone(ZoneId.of("Asia/Shanghai")).toLocalDateTime());

        List<EventInfo> todayEventList = eventsMapper.selectList(
                new LambdaQueryWrapper<EventInfo>()
                        .eq(StringUtils.isNoneBlank(appId), EventInfo::getAppId, appId)
                        .gt(EventInfo::getCreateTime, startStr)
                        .lt(EventInfo::getCreateTime, endStr))
                        .stream().toList();

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
        systemList.stream().forEach(system -> {
            Set<String> activeUsers = null;
            Set<String> todayUsers = null;
            try {
                Instant endTime = Instant.now();
                Instant startTime = endTime.minusMillis(TimeUnit.HOURS.toMillis(1));
                activeUsers = calculateUsersCount(startTime, endTime, system.getAppId(), userId);
                activeUserMap.put(system.getAppId(), activeUsers.size());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateFormatUtils.ISO_8601_EXT_DATE_PATTERN);
                List<Instant> adjustedDayBoundary = DateFormatUtils.getAdjustedDayBoundary(LocalDate.now().format(formatter));
                Instant currentDayStartTime = adjustedDayBoundary.get(0);
                Instant currentDayEndTime = adjustedDayBoundary.get(1);
                todayUsers = calculateUsersCount(currentDayStartTime, currentDayEndTime, system.getAppId(), userId);
                todayUserMap.put(system.getAppId(), todayUsers.size());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });

        AppsDashboardVo appsDashboardVo = new AppsDashboardVo(activeUserMap, todayUserMap);

        return appsDashboardVo;
    }

    private Set<String> calculateUsersCount(Instant startTime, Instant endTime, String appId, String userId) throws IOException {

        String startStr = DateFormatUtils.format(startTime.atZone(ZoneId.of("Asia/Shanghai")).toLocalDateTime());
        String endStr = DateFormatUtils.format(endTime.atZone(ZoneId.of("Asia/Shanghai")).toLocalDateTime());

        List<EventInfo> eventList = eventsMapper.selectList(new LambdaQueryWrapper<EventInfo>()
                .eq(EventInfo::getAppId, appId)
                .lt(EventInfo::getCreateTime, endStr)
                .gt(EventInfo::getCreateTime, startStr));

        List<ActionInfo> actionList = actionsMapper.selectList(new LambdaQueryWrapper<ActionInfo>()
                .eq(ActionInfo::getAppId, appId)
                .lt(ActionInfo::getCreateTime, endStr)
                .gt(ActionInfo::getCreateTime, startStr));
        // 提取并合并用户ID
        Set<String> allUserIdsFromEvents = extractUserIds(eventList);
        Set<String> allUserIdsFromActions = extractUserIds(actionList);

        // 合并两个集合中的不重复用户ID
        Set<String> combinedUserIds = new HashSet<>(allUserIdsFromEvents);
        combinedUserIds.addAll(allUserIdsFromActions);
        return combinedUserIds;
    }

    private <T extends BaseInfo> Set<String> extractUserIds(List<T> list) {
        return list.stream()
                .map(T::getUserId) // 假设EventList类有一个getUserID()方法来获取用户ID
                .collect(Collectors.toSet());
    }

    @Override
    public ErrorInfo getDetailedErrorInfoByIdentifier(String errorIdentifier) throws IOException {
        ErrorInfo errorInfo = errorsCkMapper.selectOne(new LambdaQueryWrapper<ErrorInfo>().eq(ErrorInfo::getErrorId, errorIdentifier));
        return errorInfo;
    }
}
