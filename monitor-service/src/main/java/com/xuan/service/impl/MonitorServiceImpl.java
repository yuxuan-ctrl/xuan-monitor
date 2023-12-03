package com.xuan.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xuan.dao.mapper.WebpvuvMapper;
import com.xuan.dao.pojo.dto.EventList;
import com.xuan.dao.pojo.dto.Performance;
import com.xuan.dao.pojo.dto.WebpvuvDto;
import com.xuan.dao.pojo.entity.Webpvuv;
import com.xuan.result.Result;
import com.xuan.service.MonitorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author yuxuan-ctrl
 * @since 2023-06-24
 */
@Service
@Slf4j
public class MonitorServiceImpl extends ServiceImpl<WebpvuvMapper, Webpvuv> implements MonitorService {

    @Override
    public Result<?> recordMonitorInfo(WebpvuvDto webpvuvDto) {
        log.info("监控信息：{}",webpvuvDto);
        String appId = webpvuvDto.getAppId();
        String pageUrl = webpvuvDto.getPageUrl();
        String time = webpvuvDto.getTime();
        List<EventList> eventList = webpvuvDto.getEventList();
        if(!CollectionUtils.isEmpty(eventList)){
            eventList.stream().forEach(event->{
                String type = event.getType();
                String uuid = event.getUuid();
                Integer timestamp = event.getTimestamp();
                Object errorInfo = event.getErrorInfo();
                Performance data = event.getData();
                if(type == "action"){
                }

            });
        }
        return null;
    }
}
