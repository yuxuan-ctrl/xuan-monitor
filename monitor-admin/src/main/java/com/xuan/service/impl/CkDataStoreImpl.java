package com.xuan.service.impl;

import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.dto.EventsDTO;
import com.xuan.dao.pojo.vo.AppsDashboardVo;
import com.xuan.dao.pojo.vo.MetricsVo;
import com.xuan.dao.pojo.vo.ReportVo;
import com.xuan.service.CkDataStore;
import com.xuan.service.EsDataStore;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;

@Service
public class CkDataStoreImpl implements CkDataStore {
    @Override
    public void aggregateYesterdayData() {

    }

    @Override
    public ReportVo recordMonitorInfo(EventsDTO eventsDto, HttpServletRequest httpRequest) {
        return null;
    }

    @Override
    public Void errorHandler(ErrorInfoDto errorInfoDto) {
        return null;
    }

    @Override
    public MetricsVo getMetrics(String appId, Instant startTime, Instant endTime, String userId) {
        return null;
    }

    @Override
    public List<MetricsVo> getChartsData(String appId, Instant startTime, Instant endTime) {
        return null;
    }

    @Override
    public AppsDashboardVo getAppsDashboardData(String userId) {
        return null;
    }

    @Override
    public ErrorInfoDto getErrorsDetails(String id) {
        return null;
    }
}
