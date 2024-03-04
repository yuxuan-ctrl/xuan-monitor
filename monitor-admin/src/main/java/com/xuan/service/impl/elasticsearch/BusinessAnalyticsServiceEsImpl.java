package com.xuan.service.impl.elasticsearch;

import com.xuan.common.utils.CalculateUtil;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.model.EventInfo;
import com.xuan.dao.model.StoresMetrics;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.BusinessAnalyticsService;
import com.xuan.service.ESDocumentService;
import com.xuan.service.SystemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "elasticsearch")
public class BusinessAnalyticsServiceEsImpl implements BusinessAnalyticsService {

    @Autowired
    public ESDocumentService esDocumentService;


    @Autowired
    private SystemsService systemsService;

    @Override
    public StoresMetrics fetchPerformanceMetrics(String appId, Instant analysisStartTime, Instant analysisEndTime, String optionalUserId) throws IOException {
        // 从Elasticsearch获取聚合数据
        Metrics aggregatedMetrics = fetchAggregatedMetricsFromES("events", "timestamp", EventInfo.class, new MetricsDTO(analysisStartTime, analysisEndTime, appId, null));

        // 查询今天的时间段内事件列表
        List<EventInfo> todayEventList = queryPastHoursFromES("events", "timestamp", EventInfo.class, new MetricsDTO(analysisStartTime, analysisEndTime, appId, optionalUserId));

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

    @Override
    public ErrorInfoDto getDetailedErrorInfoByIdentifier(String errorIdentifier) throws IOException {
        return esDocumentService.getById("errors",errorIdentifier,ErrorInfoDto.class);
    }

    private Metrics fetchAggregatedMetricsFromES(String index, String timestampField, Class<EventInfo> clazz, MetricsDTO metricsDTO) throws IOException {
        return esDocumentService.aggregateData(index, timestampField, clazz, metricsDTO);
    }

    private List<EventInfo> queryPastHoursFromES(String index, String timestampField, Class<EventInfo> clazz, MetricsDTO metricsDTO) throws IOException {
        return esDocumentService.queryPastHours(index, timestampField, clazz, metricsDTO);
    }

    private   Set<String> calculateUsersCount(Instant startTime,Instant endTime,String appId,String userId) throws IOException {

        MetricsDTO metricsDTO = new MetricsDTO(startTime,endTime,appId,userId);
        List<EventInfo> eventList = esDocumentService.queryPastHours("events", "timestamp", EventInfo.class,metricsDTO);
        List<Object> actionList = esDocumentService.queryPastHours("actions", "timestamp", Object.class,metricsDTO);
        // 提取并合并用户ID
        Set<String> allUserIdsFromEvents = extractUserIdsFromEventList(eventList);
        Set<String> allUserIdsFromActions = extractUserIdsFromActionList(actionList);

// 合并两个集合中的不重复用户ID
        Set<String> combinedUserIds = new HashSet<>(allUserIdsFromEvents);
        combinedUserIds.addAll(allUserIdsFromActions);
        return combinedUserIds;
    }

    // 定义两个方法来提取用户ID
    private  Set<String> extractUserIdsFromEventList(List<EventInfo> list) {
        return list.stream()
                .map(EventInfo::getUserId) // 假设EventList类有一个getUserID()方法来获取用户ID
                .collect(Collectors.toSet());
    }

    private Set<String> extractUserIdsFromActionList(List<Object> list) {
        Set<String> userIds = new HashSet<>();
        for (Object obj : list) {
            if (obj instanceof Map) { // 假设数据是Map类型，其中含有"userId"键
                Map<String, Object> mapObj = (Map<String, Object>) obj;
                if (mapObj.containsKey("userId")) {
                    String userId = (String) mapObj.get("userId");
                    userIds.add(userId);
                }
            }
        }
        return userIds;
    }
}
