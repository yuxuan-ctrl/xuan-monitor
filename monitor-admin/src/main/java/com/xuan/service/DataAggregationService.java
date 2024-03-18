package com.xuan.service;

import com.xuan.dao.model.UserAction;
import com.xuan.dao.pojo.dto.UserDetailsDTO;

import java.io.IOException;
import java.util.List;

public interface DataAggregationService {

    /**
     * 执行昨日数据的聚合计算并将结果持久化到数据库
     *
     * @throws IOException 当处理Elasticsearch数据时可能出现的IO异常
     */
    void processAndAggregateYesterdayData() throws IOException;


    }
