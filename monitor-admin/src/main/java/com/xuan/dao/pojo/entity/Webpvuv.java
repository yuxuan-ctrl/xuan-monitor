package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import lombok.*;

import java.util.Date;

/**
 * <p>
 *
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="Webpvuv对象", description="")
public class Webpvuv extends Model<Webpvuv> {

    private static final long serialVersionUID = 1L;

    private String appId;

    private Integer pv;

    private Integer uv;

    private Date createTime;

    private String type;

    private String pageUrl;



}
