package com.xuan.dao.pojo.vo;

import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsersVo  {

    String userId;
    String createTime; // 更名为create_time对应的字段
    String lastLoginTime; // 对应last_login字段

    String ipAddress;
    String platform;
    String userAgent;

    // 如果存储经纬度信息
    String location;



}
