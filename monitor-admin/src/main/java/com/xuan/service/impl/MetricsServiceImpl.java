package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mchange.v1.db.sql.ConnectionUtils;
import com.xuan.dao.mapper.ErrorMapper;
import com.xuan.dao.mapper.MetricsMapper;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.ErrorsService;
import com.xuan.service.MetricsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
public class MetricsServiceImpl extends ServiceImpl<MetricsMapper, Metrics> implements MetricsService {

    @Autowired
    public ESDocumentService esDocumentService;

    @Autowired
    private MetricsMapper metricsMapper;

    @Override
    public MetricsVo getMetrics(String userId, Instant startTime, Instant endTime) throws IOException {
         Metrics metrics= esDocumentService.aggregateData("events", "timestamp", EventList.class, new MetricsDTO(startTime, endTime, userId));
         List<Metrics> pastByMetricList= metricsMapper.selectList(new LambdaQueryWrapper<Metrics>().lt(Metrics::getCreateTime, startTime).orderByDesc(Metrics::getCreateTime));
        MetricsVo metricsVo = new MetricsVo();
        BeanUtils.copyProperties(metrics,metricsVo);
        if(!pastByMetricList.isEmpty()){
            Metrics pastByMetric = pastByMetricList.get(0);
            metricsVo.setUniqueVisitorGrowthCount(metrics.getUniqueVisitors()-pastByMetric.getUniqueVisitors());
            metricsVo.setPageViewGrowthCount(metricsVo.getTotalPageViews()-pastByMetric.getTotalPageViews());
        }
        return metricsVo;
    }


}
