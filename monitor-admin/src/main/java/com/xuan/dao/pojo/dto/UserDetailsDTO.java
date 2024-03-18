package com.xuan.dao.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDetailsDTO extends PageDTO{
    String userId;
    String startTime;
    String endTime;
}
