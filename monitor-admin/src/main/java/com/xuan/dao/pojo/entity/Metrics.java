package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("public.metrics") // 表名应为实际数据库中的表名，这里假设是'public.metrics"'
public class Metrics {

    @TableId(value = "id", type = IdType.AUTO)
    public String id; // 假设id字段类型为Long，由于是 SERIAL PRIMARY KEY，所以使用@Id和@TableId注解，并设置type=IdType.AUTO

    @TableField("most_visited_page_id")
    public String mostVisitedPageId;

    @TableField("most_visited_page_views")
    public Long mostVisitedPageViews;

    @TableField("total_stay_duration")
    public Double totalStayDuration; // 假设INTERVAL类型映射为String，具体映射方式请根据数据库驱动或框架调整

    @TableField("average_stay_duration")
    public Double averageStayDuration; // 同上

    @TableField("total_page_views")
    public Long totalPageViews;

    @TableField("unique_visitors")
    public Integer uniqueVisitors;

    @TableField("all_users_length")
    public Long allUsersLength;

    @TableField(fill = FieldFill.INSERT)
    public String createTime;

    @TableField("most_frequent_platform")
    public String mostFrequentPlatform;

    @TableField("most_frequent_screen_resolution")
    public String mostFrequentScreenResolution;


}
