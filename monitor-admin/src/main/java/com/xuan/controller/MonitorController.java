package com.xuan.controller;

import com.xuan.vo.ReportVo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/monitor")
public class MonitorController {
    @PostMapping("/report")
    public void report(ReportVo reportVo){
        System.out.println(reportVo.getData());
        System.out.println(reportVo.getAppId());
    }
}
