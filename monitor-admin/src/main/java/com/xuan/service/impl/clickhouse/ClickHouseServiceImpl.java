package com.xuan.service.impl.clickhouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.service.ClickHouseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class ClickHouseServiceImpl implements ClickHouseService {
    @Value("${xuan.task.hoursBack:24}") // 默认值为24小时
    private int hoursBack;

    @Autowired
    public EventsMapper eventsMapper;

    @Override
    public Metrics aggregateData(MetricsDTO metricsDTO) throws IOException {
        Instant startTime = metricsDTO.getStartTimeOrDefault(new Date().toInstant().minus(hoursBack, ChronoUnit.HOURS));
        Instant endTime = metricsDTO.getEndTimeOrDefault(new Date().toInstant());

        List<EventInfo> eventList = eventsMapper.selectList(
                        new LambdaQueryWrapper<EventInfo>()
                                .eq(StringUtils.isNoneBlank(metricsDTO.getAppId()),EventInfo::getAppId,metricsDTO.getAppId())
                                .gt(EventInfo::getCreateTime, startTime)
                                .lt(EventInfo::getCreateTime, endTime)
                )
                .stream().toList();
        if (!eventList.isEmpty()) {
            Metrics metrics = CalculateUtil.calculateMetrics(eventList);
            return metrics;
        }
        return null;
    }
}
