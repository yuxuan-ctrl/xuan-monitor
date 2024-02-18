package com.xuan.task;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xuan.dao.mapper.DailyTrafficAnalyticsMapper;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.entity.DailyTrafficAnalytics;
import com.xuan.service.ESDocumentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TrafficAnalyticsAggregationTask {

    @Autowired
    private ESDocumentService esDocumentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DailyTrafficAnalyticsMapper dailyTrafficAnalyticsMapper;


    public void aggregateYesterdayData() throws IOException {
        List<EventList> eventList = esDocumentService.queryPastHours("events", "timestamp", EventList.class);
        System.out.println("response.toString() -> " + eventList);
        LocalDate date = LocalDate.ofInstant(eventList.get(eventList.size()-1).getTimestamp().toInstant(), ZoneId.systemDefault()).minusDays(1); // 假设timestamp是前一天的

        Map<String, Long> platformDistribution = eventList.stream()
                .collect(Collectors.groupingBy(EventList::getPlatform, Collectors.counting()));

        Map<String, Integer> screenResolutionDistribution = eventList.stream()
                .map(event -> event.getScreenResolution())
                .flatMap(resolution -> resolution.entrySet().stream())
                .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.summingInt(Map.Entry::getValue)));

        long totalPageViews = eventList.size();
        long uniquePageViews = eventList.stream().map(EventList::getUniqueKey).distinct().count();

        double totalStayDuration = eventList.stream().mapToDouble(EventList::getStayDuration).sum();
        double averageStayDuration = totalStayDuration / Math.max(totalPageViews, 1);

        Map.Entry<String, Long> mostVisitedPageInfo = getMostVisitedPageInfo(eventList);

        System.out.println("mostVisitedPageInfo = " + mostVisitedPageInfo);

//        // 聚合昨天的数据
        DailyTrafficAnalytics dailyStats = DailyTrafficAnalytics.builder()
                .id(UUID.randomUUID().toString())
                .userId(eventList.get(0).getUserId())
                .mostVisitedPageViews(mostVisitedPageInfo.getValue())
                .mostVisitedPageId(mostVisitedPageInfo.getKey())
                .averageStayDuration(averageStayDuration)
                .date(date)
                .platformDistribution(objectMapper.writeValueAsString(platformDistribution))
                .totalPageViews(totalPageViews)
                .totalStayDuration(totalStayDuration)
                .uniquePageViews((int) uniquePageViews)
                .createTime(LocalDateTime.now())
                .screenResolutionDistribution(objectMapper.writeValueAsString(screenResolutionDistribution))
                .build();

        dailyTrafficAnalyticsMapper.insert(dailyStats);
    }

    public Map.Entry<String, Long> getMostVisitedPageInfo(List<EventList> eventList) {
        Map<String, Long> pageViewCountMap = eventList.stream()
                .collect(Collectors.groupingBy(EventList::getPageUrl, Collectors.counting()));

        Map.Entry<String, Long> maxEntry = pageViewCountMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        return maxEntry != null ? maxEntry : null;
    }
}
