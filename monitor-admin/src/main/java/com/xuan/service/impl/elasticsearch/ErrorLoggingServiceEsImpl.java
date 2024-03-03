package com.xuan.service.impl.elasticsearch;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.alibaba.fastjson.JSON;
import com.xuan.dao.mapper.postgres.ErrorMapper;
import com.xuan.dao.pojo.dto.ErrorInfoDto;
import com.xuan.dao.pojo.entity.Errors;
import com.xuan.service.ESDocumentService;
import com.xuan.service.ErrorLoggingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "elasticsearch")
public class ErrorLoggingServiceEsImpl implements ErrorLoggingService {
    @Autowired
    private ESDocumentService esDocumentService;

    @Autowired
    public ErrorMapper errorMapper;

    @Override
    public void logAndPersistError(ErrorInfoDto errorInfoDto) throws Exception {
            esDocumentService.ensureIndexExists("errors"); // 一次性检查两个索引
            errorInfoDto.setCreateTime(LocalDateTime.now().toString());
            IndexResponse response = esDocumentService.createByJson("errors", UUID.randomUUID().toString(), JSON.toJSONString(errorInfoDto));
            System.out.println("response.toString() -> " + response.toString());
            Errors errors = new Errors();
            BeanUtils.copyProperties(errorInfoDto, errors);
            errors.setEsErrorId(response.id());
            errorMapper.insert(errors);
    }
}
