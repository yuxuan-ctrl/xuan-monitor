package com.xuan.common.utils;

import org.apache.commons.lang3.time.FastTimeZone;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;


public class DateFormatUtils {
    public static final String ISO_8601_DATETIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
    public static final String ISO_8601_EXT_DATE_PATTERN = "yyyy-MM-dd";
    public static final String ISO_8601_EXT_TIME_PATTERN = "HH:mm:ss";
    public static final String ISO_8601_EXT_TIME_TIME_ZONE_PATTERN = "HH:mm:ssZZ";
    public static final String ISO_8601_EXT_DATETIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String ISO_8601_EXT_DATETIME_TIME_ZONE_PATTERN = "yyyy-MM-dd'T'HH:mm:ssZZ";



    public DateFormatUtils() {
    }

    public static String format(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern(ISO_8601_DATETIME_PATTERN));
    }

    public static String formatTimeZone(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern(ISO_8601_EXT_DATETIME_TIME_ZONE_PATTERN));
    }

    public static List<Instant> getAdjustedDayBoundary(String currentDay) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateFormatUtils.ISO_8601_EXT_DATE_PATTERN);
        LocalDate date = LocalDate.parse(currentDay, formatter);

        ZoneId targetZoneId = ZoneId.of("Asia/Shanghai");

        // 获取指定日期在上海时区的开始和结束时间
        ZonedDateTime startDateTime = date.atStartOfDay(targetZoneId);
        ZonedDateTime endDateTime = date.plusDays(1).atStartOfDay(targetZoneId);

        // 加上8小时
        Instant startTime = startDateTime.toInstant().plusMillis(TimeUnit.HOURS.toMillis(8));
        Instant endTime = endDateTime.toInstant().plusMillis(TimeUnit.HOURS.toMillis(8));

        // 创建并返回包含开始和结束时间的Instant列表
        return new ArrayList<>(Arrays.asList(startTime, endTime));
    }
}
