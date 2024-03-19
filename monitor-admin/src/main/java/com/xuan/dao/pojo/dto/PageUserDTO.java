package com.xuan.dao.pojo.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class PageUserDTO implements Serializable {
    private  int pageSize;
    private  int pageIndex;
    private  String userId ;
    private  int id;

}
