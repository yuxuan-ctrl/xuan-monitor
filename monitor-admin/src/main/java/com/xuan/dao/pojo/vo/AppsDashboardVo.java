package com.xuan.dao.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppsDashboardVo {

    private Map<String, Integer> activeUserMap;
    private Map<String, Integer> todayUserMap;
}
