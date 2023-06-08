package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
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
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="Systems对象", description="")
public class Systems extends Model<Systems> {

    private static final long serialVersionUID = 1L;

      private Integer id;

    private String type;

    private Integer isUse;

    private String appId;

    private String systemName;

    private String systemDomain;

    private Date createTime;


    @Override
    public Serializable pkVal() {
        return this.id;
    }

}
