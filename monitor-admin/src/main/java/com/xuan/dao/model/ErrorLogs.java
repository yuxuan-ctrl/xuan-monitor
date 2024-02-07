package com.xuan.dao.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Data
public class ErrorLogs extends ESDocument{

    private String systemId; // 错误来源系统标识符

    private Instant timestamp; // 错误发生时间

    private String type; // 错误类型名称

    private String message; // 错误消息

    private String stackTrace; // 错误堆栈跟踪

    private String cause; // 错误原因

    private String userAgent; // 用户代理字符串

    private String url; // 页面URL

    private List<String> operationSequence; // 操作序列

    private Map<String, Object> logContext; // 日志上下文信息

    // 其他可定制的元数据字段
    private Map<String, Object> additionalMetadata;

}
