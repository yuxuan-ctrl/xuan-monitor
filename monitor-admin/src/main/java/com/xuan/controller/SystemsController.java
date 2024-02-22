package com.xuan.controller;


import io.swagger.annotations.Api;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-05
 */
@RestController
@RequestMapping("/systems")
@Api(value = "系统管理",tags = "SystemsController")
public class SystemsController {

}

