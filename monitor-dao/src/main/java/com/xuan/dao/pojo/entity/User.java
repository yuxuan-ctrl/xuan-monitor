package com.xuan.dao.pojo.entity;

import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
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
@ApiModel(value="User对象", description="")
public class User extends Model<User> {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "用户名称")
      private String userName;

    @ApiModelProperty(value = "用户密码")
    private String passWord;

    @ApiModelProperty(value = "用户所拥有的系统Id")
    private String systemIds;

    @ApiModelProperty(value = "是否禁用 0：正常  1：禁用")
    private Integer isUse;

    @ApiModelProperty(value = "用户等级（0：管理员，1：普通用户）")
    private Integer level;

    @ApiModelProperty(value = "用户秘钥")
    private String token;

    @ApiModelProperty(value = "用户登录态秘钥")
    private String usertoken;

    @ApiModelProperty(value = "用户访问时间")
    private Date createTime;

    private Integer id;


    @Override
    public Serializable pkVal() {
        return this.userName;
    }

}
