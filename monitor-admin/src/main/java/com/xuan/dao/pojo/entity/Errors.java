package com.xuan.dao.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

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
}
