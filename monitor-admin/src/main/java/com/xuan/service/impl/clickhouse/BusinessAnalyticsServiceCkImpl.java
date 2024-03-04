package com.xuan.service.impl.clickhouse;

import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.mapper.clickhouse.EventsMapper;
import com.xuan.dao.model.EventInfo;
import com.xuan.dao.model.StoresMetrics;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.service.BusinessAnalyticsService;
import com.xuan.service.ESDocumentService;
import com.xuan.service.SystemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class BusinessAnalyticsServiceCkImpl implements BusinessAnalyticsService {

    @Autowired
    public EventsMapper eventsMapper;

    @Override
    public StoresMetrics fetchPerformanceMetrics(String appId, Instant analysisStartTime, Instant analysisEndTime, String optionalUserId) throws IOException {
        List<EventInfo> eventLists = eventsMapper.selectList(null);
        System.out.println(eventLists);
        return null;
    }

    @Override
    public List<MetricsVo> retrieveChartDataset(String appId, Instant timeRangeStart, Instant timeRangeEnd) {
        return null;
    }

    @Override
    public AppsDashboardVo getUserAppsDashboardData(String userId) {
        return null;
    }

    @Override
    public ErrorInfoDto getDetailedErrorInfoByIdentifier(String errorIdentifier) throws IOException {
        return null;
    }
}
