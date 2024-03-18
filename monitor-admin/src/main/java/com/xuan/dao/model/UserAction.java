package com.xuan.dao.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserAction {
    String type;
    String createTime;
    String Description;
    String id;
    String pageUrl;
}
