package com.xuan.dao.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Errors {
    String errorType;
    String errorMessage;
    String esErrorId;
    String url;
}
