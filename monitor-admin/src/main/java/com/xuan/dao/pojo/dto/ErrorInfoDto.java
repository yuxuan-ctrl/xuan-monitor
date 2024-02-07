package com.xuan.dao.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    String url;
    String operationSequence;
    String logContext;
    List<String> record;

}
