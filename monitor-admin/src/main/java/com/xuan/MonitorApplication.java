/*
 * @Author: yuxuan-ctrl
 * @Date: 2023-06-06 09:44:21
 * @LastEditors: yuxuan-ctrl
 * @LastEditTime: 2023-12-06 09:04:24
 * @FilePath: \xuan-monitor\monitor-admin\src\main\java\com\xuan\MonitorApplication.java
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
package com.xuan;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // 添加此注解以启用定时任务
@MapperScan("com.xuan.dao.mapper")
public class MonitorApplication {
    public static void main(String[] args) {
        SpringApplication.run(MonitorApplication.class,args);
    }
}
