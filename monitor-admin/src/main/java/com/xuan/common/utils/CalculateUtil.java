package com.xuan.common.utils;

import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.entity.Metrics;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class CalculateUtil {

    public static Metrics calculateMetrics(List<EventList> eventList){
        long totalPageViews = eventList.size();
        Set<String> allUsers = eventList.stream().map(EventList::getUserId).collect(Collectors.toSet());
        long uniqueVisitors = eventList.stream().map(EventList::getUserId).distinct().count();

        double totalStayDuration = eventList.stream().mapToDouble(EventList::getStayDuration).sum();
        double averageStayDuration = totalStayDuration / Math.max(allUsers.size(), 1);

        Map.Entry<String, Long> mostVisitedPageInfo = getMostVisitedPageInfo(eventList);

        System.out.println("mostVisitedPageInfo = " + mostVisitedPageInfo);

        Optional<Map.Entry<String, Long>> mostFrequentPlatform = eventList.stream()
                .collect(Collectors.groupingBy(EventList::getPlatform, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue());

        // 屏幕分辨率出现次数最多的情况
        Map<String, Integer> screenResolutionCounts = eventList.stream()
                .flatMap(event -> event.getScreenResolution().entrySet().stream())
                .collect(Collectors.groupingBy(
                        resolutionEntry -> resolutionEntry.getKey() + "x" + resolutionEntry.getValue(),
                        Collectors.summingInt(Map.Entry::getValue)
                ));

        Optional<Map.Entry<String, Integer>> mostFrequentScreenResolution = screenResolutionCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue());

//        // 聚合昨天的数据
        Metrics metrics = Metrics.builder()
                .id(UUID.randomUUID().toString())
                .mostVisitedPageViews(mostVisitedPageInfo.getValue())
                .mostVisitedPageId(mostVisitedPageInfo.getKey())
                .averageStayDuration(averageStayDuration)
                .totalPageViews(totalPageViews)
                .totalStayDuration(totalStayDuration)
                .uniqueVisitors((int) uniqueVisitors)
                .createTime(DateFormatUtils.format(LocalDateTime.now()))
                .mostFrequentPlatform(mostFrequentPlatform.get().getKey())
                .mostFrequentScreenResolution(mostFrequentScreenResolution.get().getKey())
                .build();


        return metrics;
    }

    public static Map.Entry<String, Long> getMostVisitedPageInfo(List<EventList> eventList) {
        Map<String, Long> pageViewCountMap = eventList.stream()
                .collect(Collectors.groupingBy(EventList::getPageUrl, Collectors.counting()));

        Map.Entry<String, Long> maxEntry = pageViewCountMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        return maxEntry != null ? maxEntry : null;
    }
}
