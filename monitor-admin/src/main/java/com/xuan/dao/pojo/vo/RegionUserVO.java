package com.xuan.dao.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegionUserVO {

    // 地区信息
    private String regionName;
    private String regionCode; // 或者其他的地区标识属性

    // 该地区的用户列表
    private Long userCount;
}
