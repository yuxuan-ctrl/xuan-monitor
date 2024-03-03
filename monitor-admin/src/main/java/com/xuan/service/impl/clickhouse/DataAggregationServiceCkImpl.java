package com.xuan.service.impl.clickhouse;

import com.xuan.service.DataAggregationService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class DataAggregationServiceCkImpl implements DataAggregationService {
    @Override
    public void processAndAggregateYesterdayData() throws IOException {

    }
}
