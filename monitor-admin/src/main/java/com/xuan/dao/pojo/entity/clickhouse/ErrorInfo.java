package com.xuan.dao.pojo.entity.clickhouse;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xuan.dao.pojo.dto.PageDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * 错误信息数据实体对象（DTO）
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorInfo implements BaseInfo{

    /**
     * 错误id，标识错误的id
     */
    private String errorId;

    /**
     * 错误类型，标识错误的类别或者错误代码
     */
    private String errorType;

    /**
     * 错误消息，详细的错误描述信息
     */
    private String errorMessage;

    /**
     * 堆栈跟踪信息，用于定位错误发生的具体位置及上下文环境
     */
    private String stackTrace;

    /**
     * 用户代理信息，通常包含客户端浏览器或其他用户端的信息
     */
    private String userAgent;

    /**
     * 错误发生的时间戳，使用Java的Timestamp类型存储精确时间
     * @JsonFormat注解用于序列化时按照"yyyy-MM-dd HH:mm:ss"格式显示日期时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp timestamp;

    /**
     * 创建时间字段，自动填充，在插入数据时由MyBatis-Plus框架维护
     */
    private String createTime; // 更改为LocalDateTime，假设ClickHouse支持该类型

    /**
     * 应用ID，标识产生错误的应用程序
     */
    private String appId;

    /**
     * 用户ID，关联触发错误的用户
     */
    private String userId;

    /**
     * 请求URL，错误发生时请求的原始URL
     */
    private String pageUrl;

    /**
     * 请求的具体资源地址
     */
    private String requestUrl;

    /**
     * 记录列表，可能包含其他与错误相关的详细记录信息（此处未启用）
     */
     private String record;


}