package com.xuan.task;


import com.xuan.dao.mapper.postgres.SystemsMapper;
import com.xuan.dao.pojo.entity.Systems;
import com.xuan.service.DataAggregationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;


@Component
public class TrafficAnalyticsAggregationTask {
    @Autowired
    public  DataAggregationService dataAggregationService;

@Autowired
public SystemsMapper systemsMapper;
    public void aggregateYesterdayData() throws IOException {
        List<Systems> systems = systemsMapper.selectList(null);
        systems.forEach(system-> {
            try {
                dataAggregationService.processAndAggregateYesterdayData(system.getAppId());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

}
