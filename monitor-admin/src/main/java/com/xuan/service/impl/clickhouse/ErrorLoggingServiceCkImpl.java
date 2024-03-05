package com.xuan.service.impl.clickhouse;

import com.xuan.dao.mapper.clickhouse.ErrorsCkMapper;
import com.xuan.dao.mapper.postgres.ErrorMapper;
import com.xuan.dao.pojo.entity.clickhouse.ErrorInfo;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.service.ErrorLoggingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class ErrorLoggingServiceCkImpl implements ErrorLoggingService {

    @Autowired
    public ErrorsCkMapper errorsCkMapper;

    @Autowired
    public ErrorMapper errorPgMapper;

    @Override
    public void logAndPersistError(ErrorInfo errorInfo) throws Exception {
        String errorId = UUID.randomUUID().toString();
        errorInfo.setErrorId(errorId);
        errorsCkMapper.insert(errorInfo);
        Errors errors = new Errors();
        BeanUtils.copyProperties(errorInfo, errors);
        errors.setEsErrorId(errorId);
        errorPgMapper.insert(errors);
    }
}
