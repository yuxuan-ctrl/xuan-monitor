package com.xuan.dao.pojo.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class PageUserDto implements Serializable {
    private  int pageSize;
    private  int pageIndex;
    private  String userName ;
    private  int id;

}
