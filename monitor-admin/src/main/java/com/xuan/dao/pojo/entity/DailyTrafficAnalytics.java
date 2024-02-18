package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nonapi.io.github.classgraph.json.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
