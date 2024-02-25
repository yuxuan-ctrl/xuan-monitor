package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Date;

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
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="Systems对象", description="")
public class Systems extends Model<Systems> {

    private String appId;

    private String appName;

    @TableField(fill = FieldFill.INSERT)
    private OffsetDateTime createTime;

    private String appType; // 系统类型（例如：Web系统、移动端系统、后台服务系统等）

}
