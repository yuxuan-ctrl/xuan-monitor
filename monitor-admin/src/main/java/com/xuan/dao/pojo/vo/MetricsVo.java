package com.xuan.dao.pojo.vo;

import com.xuan.dao.model.PageViewInfo;
import com.xuan.dao.pojo.entity.Metrics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetricsVo extends Metrics {
    private Metrics pastByMetric;
    private Long totalErrorCount;
    private Long dailyErrorCount;
    private Long resolvedErrorCount;
    private List<PageViewInfo> popularList;
    private Map<String,Long> errorsTypeMap;
    private Long realTimeUsers;
    public MetricsVo(Long totalPageViews, Integer uniqueVisitors, String createTime) {
        this.setTotalPageViews(totalPageViews);
        this.setUniqueVisitors(uniqueVisitors);
        this.setCreateTime(createTime);
    }
}
