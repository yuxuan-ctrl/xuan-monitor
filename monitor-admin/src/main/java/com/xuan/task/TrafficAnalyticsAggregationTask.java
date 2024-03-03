package com.xuan.task;


import com.xuan.service.DataAggregationService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

import java.io.IOException;


@Component
public class TrafficAnalyticsAggregationTask {
    @Autowired
    public  DataAggregationService dataAggregationService;


    public void aggregateYesterdayData() throws IOException {
        dataAggregationService.processAndAggregateYesterdayData();
    }

}
