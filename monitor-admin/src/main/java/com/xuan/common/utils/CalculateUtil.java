package com.xuan.common.utils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Component
public class CalculateUtil {

    @Autowired
    private UserMapper userMapper;

    public CalculateUtil(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public  Metrics calculateMetrics(List<EventList> eventList){
        long totalPageViews = eventList.size();
        Set<String> allUsers = eventList.stream().map(EventList::getUserId).collect(Collectors.toSet());
        long uniqueVisitors = eventList.stream().map(EventList::getUserId).distinct().count();
        long allUsersLength = userMapper.selectCount(new LambdaQueryWrapper<Users>());

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
                .allUsersLength(allUsersLength)
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

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = null;
        try {
            ipAddress = request.getHeader("x-forwarded-for");
            if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getRemoteAddr();
                if (ipAddress.equals("127.0.0.1")) {
                    // 根据网卡取本机配置的IP
                    InetAddress inet = null;
                    try {
                        inet = InetAddress.getLocalHost();
                    } catch (UnknownHostException e) {
                        e.printStackTrace();
                    }
                    ipAddress = inet.getHostAddress();
                }
            }
            // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
            if (ipAddress != null && ipAddress.length() > 15) { // "***.***.***.***".length()
                // = 15
                if (ipAddress.indexOf(",") > 0) {
                    ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
                }
            }
        } catch (Exception e) {
            ipAddress="";
        }
        // ipAddress = this.getRequest().getRemoteAddr();

        return ipAddress;
    }
}
