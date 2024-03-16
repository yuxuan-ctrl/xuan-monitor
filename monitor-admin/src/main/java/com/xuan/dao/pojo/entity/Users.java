package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import lombok.*;

import java.time.LocalDateTime;

/**
 * <p>
 *
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@ApiModel(value="Users", description="")
public class Users extends Model<Users> {

    String userId;
    LocalDateTime createTime; // 更名为create_time对应的字段
    LocalDateTime lastLoginTime; // 对应last_login字段

    String ipAddress;
    String platform;
    String userAgent;

    // 如果存储经纬度信息
    String location;
    String belongCity;


}
