package com.xuan.configuration;

import com.xuan.dao.pojo.dto.EventsDTO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SharedService {
    private Map<String, EventsDTO> appProperties = new HashMap();

    public void setAppProperties(String appId, EventsDTO eventsDTO) {
        appProperties.put(appId, eventsDTO);
    }

    public EventsDTO getSharedVariable(String appId) {
        return appProperties.get(appId);
    }
}
