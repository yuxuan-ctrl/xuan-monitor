package com.xuan.common.utils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xuan.dao.mapper.postgres.UserMapper;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.dao.model.PageViewInfo;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Component
public class CalculateUtil {

    @Autowired
    private static UserMapper userMapper;


    public CalculateUtil(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public static  Metrics calculateMetrics(List<EventInfo> eventList){
        long totalPageViews = eventList.size();
        Set<String> allUsers = eventList.stream().map(EventInfo::getUserId).collect(Collectors.toSet());
        long uniqueVisitors = eventList.stream().map(EventInfo::getUserId).distinct().count();
        long allUsersLength = userMapper.selectCount(new LambdaQueryWrapper<Users>());

        double totalStayDuration = eventList.stream().mapToDouble(EventInfo::getStayDuration).sum();
        double averageStayDuration = totalStayDuration / Math.max(allUsers.size(), 1);

        Map.Entry<String, Long> mostVisitedPageInfo = getMostVisitedPageInfo(eventList);

        System.out.println("mostVisitedPageInfo = " + mostVisitedPageInfo);

        Optional<Map.Entry<String, Long>> mostFrequentPlatform = eventList.stream()
                .collect(Collectors.groupingBy(EventInfo::getPlatform, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue());

//        // 屏幕分辨率出现次数最多的情况
//        Map<String, Integer> screenResolutionCounts = eventList.stream()
//                .flatMap(event -> event.getScreenResolution().entrySet().stream())
//                .collect(Collectors.groupingBy(
//                        resolutionEntry -> resolutionEntry.getKey() + "x" + resolutionEntry.getValue(),
//                        Collectors.summingInt(Map.Entry::getValue)
//                ));

//        Optional<Map.Entry<String, Integer>> mostFrequentScreenResolution = screenResolutionCounts.entrySet().stream()
//                .max(Map.Entry.comparingByValue());

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
//                .mostFrequentScreenResolution(mostFrequentScreenResolution.get().getKey())
                .build();


        return metrics;
    }

    public static Map.Entry<String, Long> getMostVisitedPageInfo(List<EventInfo> eventList) {
        Map<String, Long> PageViewInfoMap = eventList.stream()
                .collect(Collectors.groupingBy(EventInfo::getPageUrl, Collectors.counting()));

        Map.Entry<String, Long> maxEntry = PageViewInfoMap.entrySet().stream()
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

    public List<PageViewInfo> countAndRankPageViews(List<EventInfo> events) {
        Map<String, PageViewInfo> pageViewInfoMap = new HashMap<String, PageViewInfo>();
        events.stream().forEach(event->{
            PageViewInfo current = !ObjectUtils.isEmpty(pageViewInfoMap.get(event.getPageUrl())) ? pageViewInfoMap.get(event.getPageUrl()): new PageViewInfo();
            pageViewInfoMap.put(event.getPageUrl(),current);
        });

        // 使用Map统计每个页面URL出现的次数
        Map<String, Long> PageViewInfos = events.stream()
                .collect(Collectors.groupingBy(EventInfo::getPageUrl, Collectors.counting()));

        // 对页面访问次数进行排序（从高到低）
        List<Map.Entry<String, Long>> sortedEntries = new ArrayList<>(PageViewInfos.entrySet());
        sortedEntries.sort(Map.Entry.<String, Long>comparingByValue().reversed());

        // 取前10条记录
        List<PageViewInfo> topTenPageViews = new ArrayList<>();
        for (int i = 0; i < Math.min(sortedEntries.size(), 10); i++) {
            Map.Entry<String, Long> entry = sortedEntries.get(i);
            PageViewInfo PageViewInfo = new PageViewInfo(entry.getKey(), entry.getValue());
            topTenPageViews.add(PageViewInfo);
        }

        return topTenPageViews;
    }
    public  Map<String, Long> calculateErrorsType(List<Errors> errors) {
        Map<String, Long> errorsTypeMap = errors.stream()
                .collect(Collectors.groupingBy(Errors::getErrorType, Collectors.counting()));

        return errorsTypeMap != null ? errorsTypeMap : null;
    }




}
