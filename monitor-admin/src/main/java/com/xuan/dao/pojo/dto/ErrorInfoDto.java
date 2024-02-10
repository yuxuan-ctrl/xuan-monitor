package com.xuan.dao.pojo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorInfoDto {

    String errorType;
    String errorMessage;
    String stackTrace;
    String cause;
    String userAgent;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    Timestamp timestamp;
    String appId;
    String userId;
    String url;
    String operationSequence;
    String logContext;
    List<String> record;

}
