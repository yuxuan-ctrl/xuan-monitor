package com.xuan.dao.pojo.entity;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.xuan.common.json.MapToJsonTypeHandler;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nonapi.io.github.classgraph.json.Id;

import javax.json.Json;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyTrafficAnalytics {

    @Id
    private String id;

    private String userId;

    private LocalDate date;

    private String mostVisitedPageId;

    private Long mostVisitedPageViews;

    private Double totalStayDuration;

    private Double averageStayDuration;

    private Long totalPageViews;

    private Integer uniquePageViews;

    private String platformDistribution;

    private String screenResolutionDistribution;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

}
