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
@ApiModel(value="Users", description="")
public class Users extends Model<Users> {

    private static final long serialVersionUID = 1L;

      private String userName;

    private String passWord;

    private String systemIds;

    private Integer isUse;

    private Integer level;

    private String token;

    private String usertoken;

    private Date createTime;

    private Integer id;


    @Override
    public Serializable pkVal() {
        return this.userName;
    }

}
