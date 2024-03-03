package com.xuan.service.impl.clickhouse;

import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.service.ErrorLoggingService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class ErrorLoggingServiceCkImpl implements ErrorLoggingService {

    @Override
    public void logAndPersistError(ErrorInfoDto errorInfoDto) throws Exception {

    }
}
