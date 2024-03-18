package com.xuan.dao.pojo.vo;

import com.xuan.common.result.PageResult;
import com.xuan.dao.model.UserAction;
import com.xuan.dao.pojo.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDetailsVO {
    Users user;
    PageResult<UserAction> userActionLogs;
}
