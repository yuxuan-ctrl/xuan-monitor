package com.xuan.service;

import com.xuan.dao.pojo.dto.ErrorInfoDto;

public interface ErrorLoggingService {
    /**
     * 记录错误信息到Elasticsearch并持久化到数据库
     *
     * @param errorInfoDto 错误信息实体
     * @throws Exception 当处理过程中发生异常时抛出
     */
    void logAndPersistError(ErrorInfoDto errorInfoDto) throws Exception;

}
