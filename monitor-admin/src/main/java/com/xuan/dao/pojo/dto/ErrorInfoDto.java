package com.xuan.dao.pojo.dto;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorInfoDto extends PageDTO{

    String errorType;
    String errorMessage;
    String stackTrace;
//    String cause;
    String userAgent;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    Timestamp timestamp;
    @TableField(fill = FieldFill.INSERT)
    private String createTime;
    String appId;
    String userId;
    String url;
    String requestUrl;

    //    String operationSequence;
//    String logContext;
    List<String> record;
}
