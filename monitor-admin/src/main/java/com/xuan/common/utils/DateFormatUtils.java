package com.xuan.common.utils;

import org.apache.commons.lang3.time.FastTimeZone;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


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
}
