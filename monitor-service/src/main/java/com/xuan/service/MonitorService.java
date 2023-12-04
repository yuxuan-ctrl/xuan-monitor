package com.xuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xuan.dao.pojo.dto.WebpvuvDto;
import com.xuan.dao.pojo.entity.Webpvuv;
import com.xuan.dao.pojo.vo.ReportVo;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
public interface MonitorService extends IService<Webpvuv> {
    ReportVo recordMonitorInfo(WebpvuvDto webpvuvDto);

}
