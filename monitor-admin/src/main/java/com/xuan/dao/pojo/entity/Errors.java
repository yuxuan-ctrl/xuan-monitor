package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Errors {
    String errorType;
    String errorMessage;
    String esErrorId;
    Timestamp timestamp;
    String url;
    String appId;
    String userId;
    private String createTime;
    private int isResolved;

}
