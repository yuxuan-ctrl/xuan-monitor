package com.xuan.service;

import com.xuan.dao.pojo.entity.clickhouse.ActionInfo;
import com.xuan.dao.pojo.entity.clickhouse.EventInfo;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface MonitoringDataStorageService {
    /**
     * 将监控信息记录到存储系统（如Elasticsearch或Clickhouse）
     *
     * @param appId       应用ID
     * @param userId      用户ID
     * @param actionDataList  行为数据列表
     * @param eventDataList  事件数据列表
     * @throws IOException 当存储过程出现IO异常时抛出
     */
     void recordMonitoringData(String appId, String userId, List<ActionInfo> actionDataList, List<EventInfo> eventDataList) throws IOException ;

}
