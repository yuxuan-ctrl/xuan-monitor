package com.xuan.service;

import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.dao.pojo.vo.ReportVo;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;

public interface CkDataStore {
    void aggregateYesterdayData();

    ReportVo recordMonitorInfo(EventsDTO eventsDto, HttpServletRequest httpRequest);

    Void errorHandler(ErrorInfoDto errorInfoDto);

    MetricsVo getMetrics(String appId, Instant startTime, Instant endTime, String userId);

    List<MetricsVo> getChartsData(String appId, Instant startTime, Instant endTime);

    AppsDashboardVo getAppsDashboardData(String userId);

    ErrorInfoDto getErrorsDetails(String id);
}
