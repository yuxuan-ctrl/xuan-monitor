package com.xuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mchange.v1.db.sql.ConnectionUtils;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.dao.mapper.ErrorMapper;
import com.xuan.dao.mapper.MetricsMapper;
import com.xuan.dao.mapper.SystemsMapper;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.dao.model.EventList;
import com.xuan.dao.model.PageViewInfo;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.ESDocumentService;
import com.xuan.service.ErrorsService;
import com.xuan.service.MetricsService;
import com.xuan.service.SystemsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MetricsServiceImpl extends ServiceImpl<MetricsMapper, Metrics> implements MetricsService {

    @Autowired
    public ESDocumentService esDocumentService;

    @Autowired
    private MetricsMapper metricsMapper;

    @Autowired
    private SystemsService systemsService;

    @Autowired
    private ErrorMapper errorMapper;

    @Autowired
    private CalculateUtil calculateUtil;

    @Override
    public MetricsVo getMetrics(String appId, Instant startTime, Instant endTime,String userId) throws IOException {
        Metrics metrics= esDocumentService.aggregateData("events", "timestamp", EventList.class, new MetricsDTO(startTime, endTime, appId,null));
        List<EventList> todayEventList = esDocumentService.queryPastHours("events", "timestamp", EventList.class, new MetricsDTO(startTime, endTime, appId, userId));
        List<PageViewInfo> popularList = calculateUtil.countAndRankPageViews(todayEventList);
        Map<String, Long> errorsTypeMap = calculateUtil.calculateErrorsType(errorMapper.selectList(null));
        Metrics pastByMetric= metricsMapper.selectOne(new LambdaQueryWrapper<Metrics>()
                .lt(Metrics::getCreateTime, startTime)
                .orderByDesc(Metrics::getCreateTime)
                .last("LIMIT 1"));
        Long dailyErrorCount = errorMapper.selectCount(new LambdaQueryWrapper<Errors>()
                .between(Errors::getCreateTime, startTime, endTime));
        List<Errors> totalErrorList = errorMapper.selectList(new LambdaQueryWrapper<Errors>().eq(Errors::getAppId,appId));
        Long resolvedErrorCount = totalErrorList.stream().filter(item-> item.getIsResolved() == 1).count();
        MetricsVo metricsVo = new MetricsVo(pastByMetric, (long) totalErrorList.size(),dailyErrorCount,resolvedErrorCount,popularList,errorsTypeMap,null);


        if(!ObjectUtils.isEmpty(metrics)){
            BeanUtils.copyProperties(metrics,metricsVo);
        }
        if(!ObjectUtils.isEmpty(pastByMetric)){
            metricsVo.setPastByMetric(pastByMetric);
        }
        return metricsVo;
    }

    @Override
    public List<MetricsVo> getChartsData(String appId, Instant startTime, Instant endTime) throws IOException {
        List<Metrics> metricList= metricsMapper.selectList(new LambdaQueryWrapper<Metrics>()
                .gt(Metrics::getCreateTime, startTime)
                .lt(Metrics::getCreateTime, endTime)
                .orderByAsc(Metrics::getCreateTime));


        return metricList.stream().map(metrics -> new MetricsVo(metrics.getTotalPageViews(),metrics.getUniqueVisitors(),metrics.getCreateTime())).collect(Collectors.toList());
    }

    @Override
    public MetricsVo getAppsDashboardData(String appId,String userId) throws IOException {
        List<Systems> systemList = systemsService.getSystemList();
        List<Users> users = calculateUtil.calculateActiveUsers(appId, userId);
        return null;
    }


}
